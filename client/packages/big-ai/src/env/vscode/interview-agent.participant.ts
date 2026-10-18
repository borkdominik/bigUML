/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import type { OnActivate, OnDispose } from '@borkdominik-biguml/big-vscode/vscode';
import { injectable } from 'inversify';
import * as vscode from 'vscode';
import { AI_PARTICIPANT_ID, COMMAND_PATTERNS, SYSTEM_PROMPT, UML_TOOL_NAMES } from '../common/index.js';
import type {
    CompleteInterviewStepInput,
    GenerateClassDiagramInput,
    InterviewPhase,
    InterviewState,
    ParsedCommand,
    ProposeDiagramInput
} from '../common/tool-types.js';
import { InterviewSessionManager, type InterviewStepPolicy, type StepAdvancementSignal } from './interview-session-manager.js';
import { formatProposalSummary } from './proposal-summary.js';
import { resolveWorkspacePath } from './tools/tool-utils.js';

const MAX_PROPOSAL_LOOKBACK_TURNS = 10;
const HISTORY_TOKEN_BUDGET_FRACTION = 0.5;
const NO_TOOL_NAMES: readonly string[] = [];
const GENERATION_TOOL_NAMES = [UML_TOOL_NAMES.generateClassDiagram] as const;
const STEP_COMPLETION_TOOL_NAMES = [UML_TOOL_NAMES.completeInterviewStep] as const;
const INTERVIEW_TOOL_NAMES = [UML_TOOL_NAMES.readUmlFile, UML_TOOL_NAMES.proposeDiagram] as const;
const CONFIRMATION_TOOL_NAMES = [UML_TOOL_NAMES.readUmlFile, UML_TOOL_NAMES.proposeDiagram, UML_TOOL_NAMES.confirmGeneration] as const;
const MODIFY_TOOL_NAMES = [
    UML_TOOL_NAMES.readUmlFile,
    UML_TOOL_NAMES.createUmlFile,
    UML_TOOL_NAMES.addNode,
    UML_TOOL_NAMES.addClassMember,
    UML_TOOL_NAMES.removeNode,
    UML_TOOL_NAMES.addRelation,
    UML_TOOL_NAMES.removeRelation
] as const;
// Tools that change a .uml file on disk — after these the open diagram is refreshed so edits are visible.
const MUTATING_TOOL_NAMES: ReadonlySet<string> = new Set<string>([
    UML_TOOL_NAMES.createUmlFile,
    UML_TOOL_NAMES.addNode,
    UML_TOOL_NAMES.addClassMember,
    UML_TOOL_NAMES.removeNode,
    UML_TOOL_NAMES.addRelation,
    UML_TOOL_NAMES.removeRelation
]);
type HistoryTurn = vscode.ChatRequestTurn | vscode.ChatResponseTurn;
const STATUS_INTENT_PATTERNS: readonly RegExp[] = [
    /\bgive\s+me\s+(a\s+)?summary\b/i,
    /\bshow\s+me\s+(the\s+)?(plan|table|steps)\b/i,
    /\bwhat\s+have\s+we\s+(done|covered)\b/i,
    /\bwhere\s+(are\s+we|do\s+we\s+stand)\b/i,
    /\bsummary\s+of\s+steps\b/i,
    /\bprogress\s+(so\s+far|update)\b/i,
    /\b(current\s+)?status\s+(of|on)\s+(the\s+)?(interview|session|diagram)\b/i,
    /\bshow\s+(current\s+)?progress\b/i,
    /\bplanning\s+mode\b/i
];

function looksLikePlanningRequest(text: string): boolean {
    const trimmed = text.trim();
    if (!trimmed) {
        return false;
    }
    return /\b(plan|planning\s+mode|show\s+plan|progress\s+overview)\b/i.test(trimmed);
}

function isGenuineAnswer(command: ParsedCommand, sessionActive: boolean): boolean {
    return sessionActive && (command.type === 'default' || (command.type === 'interview' && command.argument.trim().length > 0));
}

function looksLikeStatusRequest(text: string): boolean {
    const trimmed = text.trim();
    if (!trimmed) {
        return false;
    }
    return STATUS_INTENT_PATTERNS.some(pattern => pattern.test(trimmed));
}

@injectable()
export class InterviewAgentParticipant implements OnActivate, OnDispose {
    protected participant?: vscode.ChatParticipant;
    protected outputChannel: vscode.OutputChannel;
    protected readonly sessionManager = new InterviewSessionManager();

    constructor() {
        this.outputChannel = vscode.window.createOutputChannel('big-ai');
    }

    onActivate(): void {
        if (!vscode.chat?.createChatParticipant) {
            return;
        }

        this.participant = vscode.chat.createChatParticipant(AI_PARTICIPANT_ID, this.handleRequest.bind(this));

        this.participant.followupProvider = {
            provideFollowups: this.provideFollowups.bind(this)
        };

        this.outputChannel.appendLine('[big-ai] Interview Agent participant registered with follow-up provider');
    }

    /** Pick the chat model from `bigUML.ai.modelVendor`/`modelFamily` with graceful fallback to any available model. */
    protected async selectModel(): Promise<vscode.LanguageModelChat | undefined> {
        const config = vscode.workspace.getConfiguration('bigUML.ai');
        const vendor = config.get<string>('modelVendor')?.trim() || 'copilot';
        const family = config.get<string>('modelFamily')?.trim();

        if (family) {
            const requested = await vscode.lm.selectChatModels({ vendor, family });
            if (requested.length > 0) {
                return requested[0];
            }
            this.outputChannel.appendLine(
                `[big-ai] Requested model ${vendor}/${family} not available, falling back to any ${vendor} model`
            );
        }

        const sameVendor = await vscode.lm.selectChatModels({ vendor });
        if (sameVendor.length > 0) {
            return sameVendor[0];
        }
        const anyModel = await vscode.lm.selectChatModels();
        return anyModel[0];
    }

    protected async selectHistoryWindow(history: readonly HistoryTurn[], model: vscode.LanguageModelChat): Promise<HistoryTurn[]> {
        const budget = Math.floor(model.maxInputTokens * HISTORY_TOKEN_BUDGET_FRACTION);
        const selected: HistoryTurn[] = [];
        let used = 0;

        for (const turn of [...history].reverse()) {
            const text = turn instanceof vscode.ChatRequestTurn ? turn.prompt : this.responseTurnText(turn);
            const cost = (await model.countTokens(text)) * 2;
            if (used + cost > budget && selected.length > 0) {
                break;
            }
            used += cost;
            selected.unshift(turn);
        }

        return selected;
    }

    protected buildHistoryMessages(history: readonly HistoryTurn[]): vscode.LanguageModelChatMessage[] {
        const messages: vscode.LanguageModelChatMessage[] = [];

        for (const turn of history) {
            if (turn instanceof vscode.ChatRequestTurn) {
                messages.push(vscode.LanguageModelChatMessage.User(turn.prompt));
            } else if (turn instanceof vscode.ChatResponseTurn) {
                const responseText = turn.response
                    .filter((part): part is vscode.ChatResponseMarkdownPart => part instanceof vscode.ChatResponseMarkdownPart)
                    .map(part => part.value.value)
                    .join('\n');

                const clean = this.stripExtensionRenderedContent(responseText);
                if (clean.trim()) {
                    messages.push(vscode.LanguageModelChatMessage.Assistant(clean));
                }
            }
        }
        return messages;
    }

    protected stripExtensionRenderedContent(text: string): string {
        let result = text;

        result = result.replace(/\*\*Step\s+\d+\s+of\s+6\s*[\u2014-][^\n*]*\*\*\s*\n*/gi, '');
        result = result.replace(/\*Steps?\s+\d+[\u2013\u2014-]\d+\s+detected[^\n]*\*\s*\n*/gi, '');
        result = result.replace(/(?:^|\n)\|[^\n]+\|\s*\n\|[\s:|-]+\|(?:\s*\n\|[^\n]+\|)*/g, '');
        result = result.replace(/✅\s*\*\*Interview complete\*\*[^\n]*\n*/gi, '');
        result = result.replace(/Start a new session at any time[^\n]*\n*/gi, '');
        result = result.replace(/No active interview session[^\n]*\n*/gi, '');

        return result.trim();
    }

    protected buildInterviewTranscript(history: readonly HistoryTurn[]): string {
        const lines: string[] = [];

        for (const turn of history) {
            if (turn instanceof vscode.ChatRequestTurn) {
                lines.push(`User: ${turn.prompt}`);
                continue;
            }

            if (turn instanceof vscode.ChatResponseTurn) {
                const responseText = this.stripExtensionRenderedContent(this.responseTurnText(turn));
                if (responseText.trim()) {
                    lines.push(`Assistant: ${responseText}`);
                }
            }
        }

        return lines.length > 0 ? lines.join('\n\n') : 'No prior chat history.';
    }

    protected responseTurnText(turn: vscode.ChatResponseTurn): string {
        return turn.response
            .filter((part): part is vscode.ChatResponseMarkdownPart => part instanceof vscode.ChatResponseMarkdownPart)
            .map(part => part.value.value)
            .join('\n');
    }

    protected buildUserMessage(request: vscode.ChatRequest, command: ParsedCommand, overridePrompt?: string): string {
        if (overridePrompt !== undefined) {
            return overridePrompt;
        }

        if (command.argument.trim()) {
            return command.argument.trim();
        }

        const defaults: Record<string, string> = {
            interview: 'Please start a requirements interview for a UML class diagram.',
            plan: 'Please show the current interview progress overview.',
            modify: 'Please suggest improvements to the current design.',
            explain: 'Please explain the current UML structure.',
            default: request.prompt
        };

        return defaults[command.type] ?? request.prompt;
    }

    protected isSkipRequest(text: string): boolean {
        return /^(?:\/)?(?:skip|next|continue)(?:\s+(?:this|step|the))?$/i.test(text.trim());
    }

    protected shouldAdvanceCurrentStep(stepPolicy: InterviewStepPolicy | undefined, prompt: string): boolean {
        const normalized = prompt.trim();
        if (!normalized) {
            return false;
        }

        const signals = stepPolicy?.advancementSignals ?? [];
        if (signals.length === 0) {
            return false;
        }

        return signals.some(signal => this.matchesAdvancementSignal(signal, normalized));
    }

    protected matchesAdvancementSignal(signal: StepAdvancementSignal, prompt: string): boolean {
        switch (signal) {
            case 'entity-list':
                return this.hasEntityList(prompt);
            case 'class-declaration':
                return this.hasClassOrInterfaceDeclaration(prompt);
            case 'relationship':
                return this.hasRelationshipSignal(prompt);
            case 'multiplicity-or-details':
                return this.hasMultiplicitySignal(prompt) || this.hasNoAdditionalDetailsSignal(prompt);
            case 'confirmation':
                return this.sessionManager.isConfirmationAnswer(prompt);
            default:
                return false;
        }
    }

    protected hasEntityList(prompt: string): boolean {
        const itemCount = this.countListItems(prompt);
        if (itemCount >= 3 || (/\b(?:entities|classes|interfaces)\b/i.test(prompt) && itemCount >= 2)) {
            return true;
        }

        const stopWords = new Set([
            'the',
            'a',
            'an',
            'and',
            'or',
            'of',
            'to',
            'for',
            'with',
            'in',
            'on',
            'at',
            'by',
            'is',
            'are',
            'was',
            'were',
            'be',
            'being',
            'been',
            'this',
            'that',
            'these',
            'those',
            'what',
            'which',
            'who',
            'whom',
            'whose',
            'please',
            'main',
            'top',
            'level',
            'system',
            'diagram',
            'uml',
            'create',
            'class',
            'classes',
            'interface',
            'interfaces'
        ]);

        const contentWords =
            prompt
                .toLowerCase()
                .match(/\b[a-z][a-z0-9_-]*\b/g)
                ?.filter(word => !stopWords.has(word)) ?? [];

        return contentWords.length >= 3;
    }

    protected hasClassOrInterfaceDeclaration(prompt: string): boolean {
        const text = prompt.trim();
        if (!text) return false;

        if (/^[^\S\r\n]*[A-Za-z][^:\n]{0,40}\s*(?::|-)/m.test(text)) {
            return true;
        }

        if (/^\s*([-*\u2022]|\d+\.)\s+/m.test(text)) {
            const items = text
                .split(/\r?\n/)
                .map(l => l.replace(/^\s*([-*\u2022]|\d+\.)\s+/, '').trim())
                .filter(Boolean);
            if (items.length >= 2) return true;
        }

        const commaParts = text
            .split(/,|;/)
            .map(s => s.trim())
            .filter(Boolean);
        if (commaParts.length >= 2) {
            const candidateCount = commaParts.filter(p => /[A-Za-z0-9_]/.test(p)).length;
            if (candidateCount >= 2) return true;
        }

        if (/\b(class|classes|interface|interfaces|abstract|abstract class)\b/i.test(text)) {
            return true;
        }

        const namedTypes = text.match(/\b[A-Z][A-Za-z0-9_]*\b/g) ?? [];
        if (namedTypes.length >= 2) return true;

        return false;
    }

    protected hasRelationshipSignal(prompt: string): boolean {
        const text = prompt.trim();
        if (!text) return false;

        if (
            /^[^\S\r\n]*[A-Za-z][^:\n]{0,40}\s*(?::|-)/m.test(text) &&
            /\b(relat|connect|communicat|depend|link|assoc|aggregate|compose|inherit|extend|implement|use|call|send|path|route)\b/i.test(
                text
            )
        ) {
            return true;
        }

        if (/->|<-|<->/.test(text)) return true;

        if (/\([^()]{2,20}\)/.test(text) && /\b[A-Z][A-Za-z0-9_]*\b\s+\b[A-Z][A-Za-z0-9_]*\b/.test(text)) return true;

        if (/\b[A-Z][A-Za-z0-9_]*\b\s+\b[A-Z][A-Za-z0-9_]*\b(\s*\([^)]*\))?/.test(text)) return true;

        if (
            /\b(connects?|connected to|calls?|sends?|communicat(?:e|es|ed)|talks? to|relates? to|depends on|uses|contains|associat(?:e|es|ed))\b/i.test(
                text
            )
        )
            return true;

        return false;
    }

    protected hasMultiplicitySignal(prompt: string): boolean {
        return /\b(\d+\s*\.\.\s*\d+|\d+\s*\.\.\s*\*|\*|one to many|many to one|many to many|one to one|0\.\.1|1\.\.\*|0\.\.\*)\b/i.test(
            prompt
        );
    }

    protected hasNoAdditionalDetailsSignal(prompt: string): boolean {
        return /\b(no|none|nothing|nope|skip|empty|leave\s+them\s+empty|no\s+additional\s+(details|attributes)|nothing\s+else)\b/i.test(
            prompt
        );
    }

    protected countListItems(prompt: string): number {
        return prompt
            .split(/,|\band\b|\b&\b/i)
            .map(part => part.trim())
            .filter(Boolean).length;
    }

    protected isUncertainAnswer(prompt: string): boolean {
        return /\b(i\s+don'?t\s+know|dont\s+know|not\s+sure|unsure|no\s+idea)\b/i.test(prompt);
    }

    protected normalizeRevisionText(text: string): string {
        const trimmed = text.trim().replace(/\s+/g, ' ');
        if (!trimmed) {
            return '';
        }

        return trimmed.replace(/^\/?(?:interview|plan|modify|explain)\b\s*/i, '');
    }

    protected normalizeIncomingPrompt(prompt: string): string {
        return prompt
            .trim()
            .replace(/^@\w+\s+/i, '')
            .trim();
    }

    protected async handleStepTurn(
        stepNumber: number,
        prompt: string,
        model: vscode.LanguageModelChat,
        token: vscode.CancellationToken
    ): Promise<{ advanced: boolean; generationConfirmed: boolean; summary?: string }> {
        switch (stepNumber) {
            case 1:
                return this.handleScopeStep(prompt, model, token);
            case 2:
                return this.handleClassStep(prompt, model, token);
            case 3:
                return this.handleRelationshipStep(prompt, model, token);
            case 4:
                return this.handleDetailStep(prompt, model, token);
            case 5:
                return this.handleConfirmationStep(prompt);
            default:
                return { advanced: false, generationConfirmed: false };
        }
    }

    protected async handleScopeStep(
        prompt: string,
        _model: vscode.LanguageModelChat,
        _token: vscode.CancellationToken
    ): Promise<{ advanced: boolean; generationConfirmed: boolean; summary?: string }> {
        const parsed = this.sessionManager.applyStepInput(1, prompt);
        const summary = parsed.summary || 'Scope identified';
        this.sessionManager.completeCurrentStep(summary);
        this.sessionManager.advanceToNextStep();
        return { advanced: true, generationConfirmed: false, summary };
    }

    protected async handleClassStep(
        prompt: string,
        _model: vscode.LanguageModelChat,
        _token: vscode.CancellationToken
    ): Promise<{ advanced: boolean; generationConfirmed: boolean; summary?: string }> {
        const parsed = this.sessionManager.applyStepInput(2, prompt);
        const summary = parsed.summary || 'Classes identified';
        this.sessionManager.completeCurrentStep(summary);
        this.sessionManager.advanceToNextStep();
        return { advanced: true, generationConfirmed: false, summary };
    }

    protected async handleRelationshipStep(
        prompt: string,
        _model: vscode.LanguageModelChat,
        _token: vscode.CancellationToken
    ): Promise<{ advanced: boolean; generationConfirmed: boolean; summary?: string }> {
        const parsed = this.sessionManager.applyStepInput(3, prompt);
        const summary = parsed.summary || 'Relationships identified';
        return { advanced: false, generationConfirmed: false, summary };
    }

    protected async handleDetailStep(
        prompt: string,
        _model: vscode.LanguageModelChat,
        _token: vscode.CancellationToken
    ): Promise<{ advanced: boolean; generationConfirmed: boolean; summary?: string }> {
        const parsed = this.sessionManager.applyStepInput(4, prompt);
        const summary = parsed.summary || 'Details identified';
        this.sessionManager.completeCurrentStep(summary);
        this.sessionManager.advanceToNextStep();
        return { advanced: true, generationConfirmed: false, summary };
    }

    protected async handleConfirmationStep(prompt: string): Promise<{ advanced: boolean; generationConfirmed: boolean; summary?: string }> {
        const isConfirmation = this.sessionManager.isConfirmationAnswer(prompt);
        if (!isConfirmation) {
            return { advanced: false, generationConfirmed: false };
        }

        this.sessionManager.completeCurrentStep('Diagram confirmed');
        this.sessionManager.advanceToNextStep();
        return { advanced: true, generationConfirmed: true, summary: 'Diagram confirmed' };
    }

    protected async handleRequest(
        request: vscode.ChatRequest,
        context: vscode.ChatContext,
        stream: vscode.ChatResponseStream,
        token: vscode.CancellationToken
    ): Promise<vscode.ChatResult> {
        const parsedCommand = this.parseCommand(request.prompt, request.command);
        const statusQuerySource = parsedCommand.type === 'interview' ? parsedCommand.argument : request.prompt;
        const isStatusRequest = looksLikeStatusRequest(statusQuerySource);
        const isPlanningRequest = parsedCommand.type === 'plan' || looksLikePlanningRequest(statusQuerySource);
        const interviewState = this.deriveInterviewState(context, request.prompt, parsedCommand);
        // The step machine (step header, step-scoped system instructions, step-scoped tool restrictions)
        // must only ever engage for the interview itself — never for /modify, /explain, or /plan, even if
        // an interview session happens to be active in the background.
        const isInterviewFlow = parsedCommand.type === 'interview' || parsedCommand.type === 'default';
        // The 6-step session is hard-coded to class-diagram language ("main entities", "classes and
        // interfaces", "associations and multiplicities"), so any diagram type it can't speak to bypasses
        // it entirely and uses the legacy single-pass propose/confirm flow instead.
        const isDeploymentInterview = interviewState.diagramType === 'DEPLOYMENT' || interviewState.diagramType === 'ACTIVITY';

        const isBareInterview = parsedCommand.type === 'interview' && !parsedCommand.argument.trim();
        const isNewSessionRequest = parsedCommand.type === 'interview' && (!this.sessionManager.isActive || isBareInterview);
        const genuineAnswer = isGenuineAnswer(parsedCommand, this.sessionManager.isActive);
        const skipRequest = this.isSkipRequest(statusQuerySource);
        const currentStepNumberBeforeSkip = this.sessionManager.currentStepNumber;
        const currentStepPolicy = this.sessionManager.currentStep?.definition.policy;
        const canSkipCurrentStep = currentStepPolicy?.canSkip === true;
        const skipApplied = isInterviewFlow && this.sessionManager.isActive && skipRequest && canSkipCurrentStep;
        const skipBlockedAtCurrentStep = isInterviewFlow && this.sessionManager.isActive && skipRequest && !canSkipCurrentStep;

        this.outputChannel.appendLine(`[big-ai] Request: "${request.prompt}"`);
        this.outputChannel.appendLine(`[big-ai] Command type: ${parsedCommand.type}`);
        this.outputChannel.appendLine(
            `[big-ai] Session active: ${this.sessionManager.isActive}, completed: ${this.sessionManager.isCompleted}`
        );
        this.outputChannel.appendLine(`[big-ai] Interview phase: ${interviewState.phase}`);
        this.outputChannel.appendLine(`[big-ai] Awaiting confirmation: ${interviewState.awaitingConfirmation}`);
        this.outputChannel.appendLine(`[big-ai] Conversation turn: ${context.history.length + 1}`);

        if (isNewSessionRequest && !isStatusRequest) {
            if (isDeploymentInterview) {
                this.outputChannel.appendLine(
                    `[big-ai] ${interviewState.diagramType} diagram requested — using the legacy (non-stepped) interview flow, no step session started`
                );
            } else {
                // context.history is everything before this turn, i.e. exactly the boundary of "belongs to a
                // prior (possibly already-completed) interview" vs. "belongs to this new one".
                this.sessionManager.startNew(context.history.length);
                this.outputChannel.appendLine('[big-ai] New interview session started');
            }
        }

        if (isStatusRequest || isPlanningRequest) {
            const session = this.sessionManager.session;

            if (this.sessionManager.isCompleted) {
                stream.markdown(
                    `✅ **Interview complete** — your diagram has been created.\n\n${this.sessionManager.buildProgressSummary()}`
                );
            } else if (session?.isActive) {
                stream.markdown(this.sessionManager.buildProgressSummary());
            } else {
                stream.markdown('No active interview session. Start one with `/interview`.');
            }

            return {
                metadata: {
                    command: parsedCommand.type,
                    toolUsed: false,
                    responseStreamed: true,
                    commandArgument: statusQuerySource,
                    statusOnly: true,
                    planningOnly: isPlanningRequest,
                    sessionActive: this.sessionManager.isActive,
                    sessionCompleted: this.sessionManager.isCompleted,
                    currentStepNumber: this.sessionManager.currentStepNumber
                }
            };
        }

        if (skipBlockedAtCurrentStep) {
            const blockedMessage =
                currentStepPolicy?.skipBlockedMessage ?? 'This step cannot be skipped right now. Please answer the current step question.';
            const summary = currentStepPolicy?.summaryMode === 'diagram' ? this.sessionManager.buildDiagramSummary() : '';
            stream.markdown(`${summary}\n${blockedMessage}`);

            return {
                metadata: {
                    command: parsedCommand.type,
                    toolUsed: false,
                    responseStreamed: true,
                    commandArgument: statusQuerySource,
                    sessionActive: this.sessionManager.isActive,
                    sessionCompleted: this.sessionManager.isCompleted,
                    currentStepNumber: this.sessionManager.currentStepNumber,
                    awaitingConfirmation: currentStepPolicy?.summaryMode === 'diagram'
                }
            };
        }

        if (skipApplied) {
            this.sessionManager.advanceToNextStep();
            this.outputChannel.appendLine(
                `[big-ai] Skipped step ${currentStepNumberBeforeSkip}, advanced to ${this.sessionManager.currentStepNumber}`
            );
        }

        const activeStepPolicy = this.sessionManager.currentStep?.definition.policy;
        const shouldRenderDiagramSummary =
            isInterviewFlow &&
            this.sessionManager.isActive &&
            activeStepPolicy?.summaryMode === 'diagram' &&
            !this.sessionManager.isConfirmationAnswer(request.prompt);

        if (shouldRenderDiagramSummary) {
            const requestedRevision =
                skipRequest || this.isUncertainAnswer(request.prompt)
                    ? undefined
                    : this.normalizeRevisionText(statusQuerySource || request.prompt);
            if (requestedRevision) {
                this.sessionManager.applyRevisionToDraft(requestedRevision);
            }
            const summary = this.sessionManager.buildDiagramSummary();
            stream.markdown(`${summary}Shall I create the diagram with these elements? Reply \`yes\` to accept or ask for a revision.`);

            return {
                metadata: {
                    command: parsedCommand.type,
                    toolUsed: false,
                    responseStreamed: true,
                    commandArgument: statusQuerySource,
                    sessionActive: this.sessionManager.isActive,
                    sessionCompleted: this.sessionManager.isCompleted,
                    currentStepNumber: this.sessionManager.currentStepNumber,
                    awaitingConfirmation: true
                }
            };
        }

        const model = await this.selectModel();
        if (!model) {
            stream.markdown(
                '**Error**: No compatible chat model is available. Please ensure GitHub Copilot Chat is installed and authenticated, or adjust `bigUML.ai.modelVendor` / `bigUML.ai.modelFamily` in settings.'
            );
            return {
                metadata: {
                    command: parsedCommand.type,
                    toolUsed: false,
                    error: 'MODEL_UNAVAILABLE'
                }
            };
        }
        this.outputChannel.appendLine(`[big-ai] Using model: ${model.vendor}/${model.family} (${model.name})`);

        let stepAdvancedThisTurn = false;
        let generationConfirmedThisTurn = false;
        let skipAheadCount = 0;
        let responseStreamed = false;
        let step3CompletionPending = false;
        let step3FallbackSummary: string | undefined;
        let modifiedUri: vscode.Uri | undefined;

        if (genuineAnswer && this.sessionManager.isActive && !skipApplied) {
            skipAheadCount = this.runSkipAheadDetection(request.prompt);
        }

        if (genuineAnswer && this.sessionManager.isActive && skipAheadCount === 0 && !skipApplied) {
            const stepNum = this.sessionManager.currentStepNumber;

            const isOnStep5 = stepNum === 5;
            const isConfirmation = this.sessionManager.isConfirmationAnswer(request.prompt);

            this.outputChannel.appendLine(`[big-ai] Genuine answer for step ${stepNum}, confirmation=${isConfirmation}`);
            if (isOnStep5 && !isConfirmation) {
                this.outputChannel.appendLine('[big-ai] Step 5: non-confirmation answer, holding on step 5');
            } else {
                const stepResult = await this.handleStepTurn(stepNum, request.prompt, model, token);
                stepAdvancedThisTurn = stepResult.advanced;
                generationConfirmedThisTurn = stepResult.generationConfirmed;

                if (stepNum === 3) {
                    step3CompletionPending = true;
                    step3FallbackSummary = stepResult.summary;
                }

                if (stepResult.summary) {
                    this.outputChannel.appendLine(`[big-ai] Step ${stepNum} summary: ${stepResult.summary}`);
                }

                if (generationConfirmedThisTurn) {
                    this.outputChannel.appendLine('[big-ai] Step 5 confirmed — generation runs on step 6 this turn');
                }

                if (stepResult.advanced) {
                    this.outputChannel.appendLine(`[big-ai] Advanced to step ${this.sessionManager.currentStepNumber}`);
                }
            }
        }

        if (
            step3CompletionPending &&
            !stepAdvancedThisTurn &&
            this.sessionManager.isActive &&
            this.sessionManager.currentStepNumber === 3
        ) {
            const summary = step3FallbackSummary?.trim() || this.sessionManager.currentStep?.definition.title || 'Relationships identified';
            this.outputChannel.appendLine('[big-ai] Step 3 fallback: advancing after relationship summary without tool call');
            this.sessionManager.completeCurrentStep(summary);
            this.sessionManager.advanceToNextStep();
            stepAdvancedThisTurn = true;
        }

        const stepNum = this.sessionManager.currentStepNumber;
        const isOnStep6 = isInterviewFlow && this.sessionManager.isActive && stepNum === 6;
        const isOnStep3 = isInterviewFlow && this.sessionManager.isActive && stepNum === 3;
        const isModify = parsedCommand.type === 'modify' && !interviewState.awaitingConfirmation;

        const allowedToolNames: readonly string[] = isOnStep6
            ? GENERATION_TOOL_NAMES
            : isOnStep3
              ? STEP_COMPLETION_TOOL_NAMES
              : isModify
                ? MODIFY_TOOL_NAMES
                : !this.sessionManager.isActive
                  ? interviewState.awaitingConfirmation
                      ? CONFIRMATION_TOOL_NAMES
                      : INTERVIEW_TOOL_NAMES
                  : NO_TOOL_NAMES;
        const requireToolCalls = isOnStep6;

        this.outputChannel.appendLine(`[big-ai] Step: ${stepNum}, tools: [${allowedToolNames.join(', ')}]`);

        const session = this.sessionManager.session;

        // The step header / completion banner is rendered ahead of whatever text the model streams next.
        // Emitting it as its own stream.markdown() call would put it in its own ChatResponseMarkdownPart,
        // and VS Code's chat renderer trims each part's edge whitespace before stitching parts together —
        // silently eating the blank line between them. Instead, hold it and prepend it onto the *first*
        // markdown this turn actually emits (streamed text or a tool-driven message), so the blank line
        // stays internal to one string. If nothing else renders this turn, it's flushed as a fallback below.
        let pendingLeadingMarkdown = '';
        if (isInterviewFlow && this.sessionManager.isCompleted) {
            pendingLeadingMarkdown =
                '✅ **Interview complete** — your diagram has been created.\n\nStart a new session at any time with `/interview`.\n\n';
        } else if (isInterviewFlow && session?.isActive) {
            pendingLeadingMarkdown = this.sessionManager.buildStepHeader();
        }
        const emitMarkdown = (text: string): void => {
            if (pendingLeadingMarkdown) {
                stream.markdown(pendingLeadingMarkdown + text);
                pendingLeadingMarkdown = '';
            } else {
                stream.markdown(text);
            }
        };

        // A step-based session must never see turns from a previous (possibly already-completed) interview —
        // otherwise the model tends to carry over that interview's entities/relationships into this one
        // instead of starting fresh. The legacy flow has no such session boundary, so it keeps full history.
        const scopedHistory = session?.isActive ? context.history.slice(session.historyStartIndex) : context.history;
        const historyWindow = await this.selectHistoryWindow(scopedHistory, model);
        const historyMessages = this.buildHistoryMessages(historyWindow);
        const referenceMessages = await this.buildReferenceMessages(request);
        // Skip auto-attaching the active diagram on the confirmation turn so its path can't hijack the
        // generation target; the interview transcript / stored proposal is the source of truth there.
        const autoAttachMessages = interviewState.awaitingConfirmation ? [] : await this.buildAutoAttachMessages(request);
        const userMessagePrompt = skipApplied ? 'Please continue with the next interview step.' : undefined;

        const messages: vscode.LanguageModelChatMessage[] = [
            vscode.LanguageModelChatMessage.User(this.buildSystemMessage(request, parsedCommand, interviewState, historyWindow)),
            ...historyMessages,
            ...referenceMessages,
            ...autoAttachMessages,
            vscode.LanguageModelChatMessage.User(this.buildUserMessage(request, parsedCommand, userMessagePrompt))
        ];

        let toolUsed = false;
        let streamedText = '';
        let presentedProposal: ProposeDiagramInput | undefined;
        let generated = false;

        try {
            let generationRetryRequested = false;
            // /modify applies several sequential edits (create nodes, then relate them), so it needs more rounds.
            const maxGenerationIterations = isModify ? 8 : 3;

            for (let iteration = 0; iteration < maxGenerationIterations && !token.isCancellationRequested; iteration++) {
                this.outputChannel.appendLine(`[big-ai] LM request iteration ${iteration + 1}/${maxGenerationIterations}`);

                const response = await model.sendRequest(
                    messages,
                    {
                        tools: vscode.lm.tools.filter(tool => (allowedToolNames as readonly string[]).includes(tool.name))
                    },
                    token
                );

                const toolCalls: vscode.LanguageModelToolCallPart[] = [];
                for await (const part of response.stream) {
                    if (part instanceof vscode.LanguageModelTextPart) {
                        if (!requireToolCalls) {
                            const normalized = this.stripLeadingStepHeaderEcho(part.value);
                            if (normalized.trim()) {
                                emitMarkdown(normalized);
                                streamedText += normalized;
                                responseStreamed = true;
                            }
                        }
                        continue;
                    }
                    if (part instanceof vscode.LanguageModelToolCallPart) {
                        toolCalls.push(part);
                    }
                }

                if (toolCalls.length === 0) {
                    this.outputChannel.appendLine(`[big-ai] No tool calls in iteration ${iteration + 1}, completing`);

                    if (requireToolCalls && !generationRetryRequested) {
                        generationRetryRequested = true;
                        this.outputChannel.appendLine('[big-ai] Step 6: no tool call from LLM; deriving aggregate input as JSON');
                        const generatedInput = await this.requestGenerationInput(model, messages, token);
                        const toolResult = await vscode.lm.invokeTool(
                            UML_TOOL_NAMES.generateClassDiagram,
                            {
                                input: generatedInput as unknown as object,
                                toolInvocationToken: request.toolInvocationToken
                            },
                            token
                        );
                        toolUsed = true;
                        await this.announceGeneration(stream, generatedInput.filePath, toolResult, pendingLeadingMarkdown);
                        pendingLeadingMarkdown = '';
                        responseStreamed = true;
                        break;
                    }

                    if (requireToolCalls && !responseStreamed) {
                        this.outputChannel.appendLine('[big-ai] Step 6: generation turn produced text only; showing error');
                        emitMarkdown(
                            '**Error**: Generation was confirmed, but the diagram generator could not derive the generation input.'
                        );
                        responseStreamed = true;
                    }
                    break;
                }

                // Arm: the model proposes a diagram. Render the summary deterministically and stop.
                const proposeCall = toolCalls.find(call => call.name === UML_TOOL_NAMES.proposeDiagram);
                if (proposeCall) {
                    toolUsed = true;
                    presentedProposal = proposeCall.input as ProposeDiagramInput;
                    this.outputChannel.appendLine('[big-ai] Proposal received; rendering summary and arming gate');
                    emitMarkdown(formatProposalSummary(presentedProposal));
                    responseStreamed = true;
                    break;
                }

                // Fire: the model confirms. Generate from the stored proposal and stop.
                const confirmCall = toolCalls.find(call => call.name === UML_TOOL_NAMES.confirmGeneration);
                if (confirmCall) {
                    toolUsed = true;
                    const proposal = interviewState.pendingProposal;
                    if (!proposal) {
                        this.outputChannel.appendLine('[big-ai] Confirm called without a pending proposal');
                        emitMarkdown('**Error**: No diagram proposal is pending. Please describe the diagram so I can propose it first.');
                        responseStreamed = true;
                        break;
                    }
                    this.outputChannel.appendLine('[big-ai] Generating from stored proposal');
                    const generationTool =
                        proposal.diagramType === 'DEPLOYMENT'
                            ? UML_TOOL_NAMES.generateDeploymentDiagram
                            : UML_TOOL_NAMES.generateClassDiagram;
                    const toolResult = await vscode.lm.invokeTool(
                        generationTool,
                        {
                            input: proposal as unknown as object,
                            toolInvocationToken: request.toolInvocationToken
                        },
                        token
                    );
                    await this.announceGeneration(stream, this.inputFilePath(proposal), toolResult, pendingLeadingMarkdown);
                    pendingLeadingMarkdown = '';
                    responseStreamed = true;
                    generated = true;
                    break;
                }

                const completeStepCall = toolCalls.find(call => call.name === UML_TOOL_NAMES.completeInterviewStep);
                if (completeStepCall) {
                    toolUsed = true;
                    const completeInput = completeStepCall.input as CompleteInterviewStepInput;
                    const summary = completeInput.summary?.trim() || this.sessionManager.currentStep?.definition.title || 'Step completed';

                    this.outputChannel.appendLine(
                        `[big-ai] Step completion received for step ${completeInput.stepNumber ?? this.sessionManager.currentStepNumber}`
                    );

                    const toolResult = await vscode.lm.invokeTool(
                        UML_TOOL_NAMES.completeInterviewStep,
                        {
                            input: completeInput as unknown as object,
                            toolInvocationToken: request.toolInvocationToken
                        },
                        token
                    );

                    this.sessionManager.completeCurrentStep(summary);
                    this.sessionManager.advanceToNextStep();
                    stepAdvancedThisTurn = true;

                    messages.push(
                        vscode.LanguageModelChatMessage.User([
                            new vscode.LanguageModelToolResultPart(completeStepCall.callId, toolResult.content)
                        ])
                    );

                    break;
                }

                // Otherwise (e.g. read-uml-file): invoke and feed results back so the model can continue.
                toolUsed = true;
                this.outputChannel.appendLine(`[big-ai] Tool calls collected: ${toolCalls.length}`);
                messages.push(vscode.LanguageModelChatMessage.Assistant(toolCalls));
                for (const toolCall of toolCalls) {
                    try {
                        const toolResult = await vscode.lm.invokeTool(
                            toolCall.name,
                            {
                                input: toolCall.input as object,
                                toolInvocationToken: request.toolInvocationToken
                            },
                            token
                        );
                        this.outputChannel.appendLine(`[big-ai] Tool invoked: ${toolCall.name}`);
                        messages.push(
                            vscode.LanguageModelChatMessage.User([
                                new vscode.LanguageModelToolResultPart(toolCall.callId, toolResult.content)
                            ])
                        );

                        if (MUTATING_TOOL_NAMES.has(toolCall.name) && !this.toolResultIsError(toolResult)) {
                            const fp = this.inputFilePath(toolCall.input);
                            if (fp) {
                                try {
                                    modifiedUri = resolveWorkspacePath(fp.toLowerCase().endsWith('.uml') ? fp : `${fp}.uml`);
                                } catch {
                                    /* leave modifiedUri unchanged */
                                }
                            }
                        }
                    } catch (toolError) {
                        this.outputChannel.appendLine(
                            `[big-ai] Tool error: ${toolError instanceof Error ? toolError.message : String(toolError)}`
                        );
                        throw toolError;
                    }
                }
            }
        } catch (error) {
            this.outputChannel.appendLine(`[big-ai] Request error: ${error instanceof Error ? error.message : String(error)}`);
            if (!responseStreamed) {
                emitMarkdown(`**Error**: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
            }
        }

        // After /modify edits, the tools have written the .uml file but the open diagram is stale — anchor the
        // file and reopen it so the changes are visible.
        if (modifiedUri) {
            emitMarkdown('\n\n✓ Updated the diagram in ');
            stream.anchor(modifiedUri);
            responseStreamed = true;
            await this.openDiagram(modifiedUri);
        }

        // Fallback: nothing else rendered this turn (e.g. a tool-only turn with no visible output), so the
        // held header/banner would otherwise be silently dropped.
        if (pendingLeadingMarkdown) {
            stream.markdown(pendingLeadingMarkdown);
        }

        this.sessionManager.markFirstResponseSent();

        if (this.sessionManager.isActive && this.sessionManager.currentStepNumber === 6) {
            this.sessionManager.markComplete();
            this.outputChannel.appendLine('[big-ai] Interview session completed after step 6');
        }

        this.outputChannel.appendLine(
            `[big-ai] Response complete (tool_used: ${toolUsed}, armed: ${presentedProposal !== undefined}, generated: ${generated})`
        );

        return {
            metadata: {
                command: parsedCommand.type,
                toolUsed,
                responseStreamed,
                commandArgument: parsedCommand.argument || '',
                sessionActive: this.sessionManager.isActive,
                sessionCompleted: this.sessionManager.isCompleted,
                currentStepNumber: this.sessionManager.currentStepNumber,
                stepAdvancedThisTurn,
                generationConfirmedThisTurn,
                interviewPhase: interviewState.phase,
                awaitingConfirmation:
                    presentedProposal !== undefined ||
                    (this.sessionManager.isActive && this.sessionManager.currentStep?.definition.policy.summaryMode === 'diagram'),
                proposal: presentedProposal,
                generated,
                generationConfirmed: isOnStep6,
                presentedSummary: this.looksLikeGenerationSummary(streamedText)
            }
        };
    }

    protected generateStepSummary(stepTitle: string, userAnswer: string): string {
        const normalized = this.normalizeStepSummary(userAnswer);
        return normalized || stepTitle;
    }

    protected runSkipAheadDetection(content: string): number {
        const stepsAnswered = this.analyzeSkipAhead(content);
        const currentStep = this.sessionManager.currentStepNumber;

        const consecutive: number[] = [];
        for (let i = 0; i < stepsAnswered.length; i++) {
            if (stepsAnswered[i] === currentStep + i) {
                consecutive.push(stepsAnswered[i]);
            } else {
                break;
            }
        }

        const stepsToProcess = consecutive.length > 1 ? consecutive : [];

        for (const stepNumber of stepsToProcess) {
            if (this.sessionManager.currentStepNumber !== stepNumber) break;
            const stepTitle = this.sessionManager.currentStep?.definition.title ?? '';
            const summary = this.generateStepSummary(stepTitle, content);
            this.sessionManager.completeCurrentStep(summary);
            this.sessionManager.advanceToNextStep();
        }

        this.sessionManager.setAutoCompletedSteps(stepsToProcess);
        return stepsToProcess.length;
    }

    protected analyzeSkipAhead(content: string): number[] {
        const steps: number[] = [];
        const prompt = content.trim();

        if (!prompt) {
            return steps;
        }

        if (this.isExplicitStep1Skip(prompt)) {
            steps.push(1);
        } else {
            return steps;
        }

        if (this.isExplicitStep2Skip(prompt)) {
            steps.push(2);
        } else {
            return steps;
        }

        if (this.isExplicitStep3Skip(prompt)) {
            steps.push(3);
        } else {
            return steps;
        }

        if (this.isExplicitStep4Skip(prompt)) {
            steps.push(4);
        }

        return steps;
    }

    protected normalizeStepSummary(text: string): string {
        const trimmed = text.trim().replace(/\s+/g, ' ');
        if (!trimmed) {
            return '';
        }

        const withoutCommandPrefix = trimmed.replace(/^\/?(?:interview|plan|modify|explain)\b\s*/i, '');
        const firstSentence = withoutCommandPrefix.split(/[.!?]/)[0].trim();
        return (firstSentence || withoutCommandPrefix).slice(0, 100);
    }

    protected isExplicitStep1Skip(prompt: string): boolean {
        const hasDomain =
            /\b(system|platform|application|app|portal|tool|service|solution|domain|university|course|school|hospital|inventory|library|store|shop|booking)\b/i.test(
                prompt
            );
        const entityList = this.extractListItems(prompt);
        return hasDomain && entityList.length >= 2;
    }

    protected isExplicitStep2Skip(prompt: string): boolean {
        if (!/\b(class|classes|interface|interfaces|abstract class|abstract classes)\b/i.test(prompt)) {
            return false;
        }

        const entityList = this.extractListItems(prompt);
        if (entityList.length >= 2) {
            return true;
        }

        const namedTypes = prompt.match(/\b[A-Z][A-Za-z0-9_]*\b/g) ?? [];
        return namedTypes.length >= 2;
    }

    protected isExplicitStep3Skip(prompt: string): boolean {
        const hasRelationshipLanguage =
            /\b(relationship|relationships|associate(?:d|s|ion)?|aggregate(?:d|s|ion)?|compose(?:d|s|ion)?|inherit(?:ance|s|ed)?|extend(?:s|ed)?|implement(?:s|ed)?|depend(?:s|ed)?|use(?:s|d)?|contain(?:s|ed)?|own(?:s|ed)?|belong(?:s|ed)?|relat(?:e|es|ed|ion)|link(?:s|ed)?|connect(?:s|ed)?)\b/i.test(
                prompt
            );
        const entityList = this.extractListItems(prompt);
        return hasRelationshipLanguage && entityList.length >= 2;
    }

    protected isExplicitStep4Skip(prompt: string): boolean {
        const hasMultiplicity =
            /\b(\d+\s*\.\.\s*\d+|\d+\s*\.\.\s*\*|0\s*\.\.\s*1|1\s*\.\.\s*\*|0\s*\.\.\s*\*|1\s*:\s*\d+|\*\s*:\s*\d+|one to many|many to one|many to many|one to one|optional|exactly one)\b/i.test(
                prompt
            );
        const hasRelationshipContext = this.isExplicitStep3Skip(prompt);
        return hasMultiplicity && hasRelationshipContext;
    }

    protected extractListItems(text: string): string[] {
        const match = text.match(
            /\b(?:with|including|such as|like|consisting of|containing|having|contains|includes|entities?|classes?|interfaces?)\b[:\s]+([^\n.?!]+)/i
        );
        const source = match?.[1] ?? text;
        return source
            .split(/,|\band\b|;/i)
            .map(item => item.trim())
            .filter(item => item.length > 0);
    }

    protected buildDefaultDiagramFilePath(): string {
        return 'workspace/course_registration.uml';
    }

    protected async requestGenerationInput(
        model: vscode.LanguageModelChat,
        messages: vscode.LanguageModelChatMessage[],
        token: vscode.CancellationToken
    ): Promise<GenerateClassDiagramInput> {
        const extractionMessages = [
            ...messages,
            vscode.LanguageModelChatMessage
                .User(`Return only the JSON input for biguml-generate-class-diagram. Do not call tools and do not include markdown.
The JSON shape is:
{
  "filePath": "workspace-relative-target.uml",
  "diagramType": "CLASS",
  "entities": [
    {
      "name": "ClassName",
      "elementType": "Class | AbstractClass | Interface | Enumeration | Package | DataType | PrimitiveType",
      "properties": [{ "name": "propertyName", "typeName": "TypeName", "visibility": "PUBLIC | PRIVATE | PROTECTED | PACKAGE", "multiplicity": "optional" }],
      "operations": [{ "name": "operationName", "visibility": "PUBLIC | PRIVATE | PROTECTED | PACKAGE" }]
    }
  ],
  "relationships": [
    {
      "relationType": "Association | Aggregation | Composition | Generalization | Dependency | InterfaceRealization | Realization | Abstraction | Usage",
      "sourceName": "SourceClass",
      "targetName": "TargetClass",
      "name": "optional relation label",
      "sourceMultiplicity": "optional",
      "targetMultiplicity": "optional"
    }
  ]
}
For Generalization, sourceName is the subclass/child and targetName is the superclass/parent (e.g. "Dog extends Animal" -> sourceName Dog, targetName Animal). For Realization/InterfaceRealization, sourceName is the implementing element and targetName is the interface it realizes.
Use only confirmed information from the transcript. Include relationships after all entities. If operations have return types in the transcript, keep only the operation names because the current tool schema has no operation return type field.`)
        ];

        const response = await model.sendRequest(extractionMessages, {}, token);
        let text = '';
        for await (const part of response.stream) {
            if (part instanceof vscode.LanguageModelTextPart) {
                text += part.value;
            }
        }

        const parsed = this.parseJsonObject(text) as Partial<GenerateClassDiagramInput>;
        const requestedTargetFile = this.sessionManager.session?.draft.targetFile?.trim();
        if (requestedTargetFile && !parsed.filePath?.trim()) {
            parsed.filePath = requestedTargetFile;
        }
        if (!parsed.filePath || !parsed.filePath.trim()) {
            parsed.filePath = this.buildDefaultDiagramFilePath();
        }

        return parsed as GenerateClassDiagramInput;
    }

    protected parseJsonObject(text: string): unknown {
        const trimmed = text.trim();
        if (!trimmed) {
            throw new Error('The language model returned no generation input.');
        }

        const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
        const candidate = fencedMatch?.[1]?.trim() ?? trimmed;
        const start = candidate.indexOf('{');
        const end = candidate.lastIndexOf('}');
        if (start < 0 || end < start) {
            throw new Error('The language model did not return JSON generation input.');
        }

        try {
            return JSON.parse(candidate.slice(start, end + 1));
        } catch (error) {
            throw new Error(`Invalid JSON generation input: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    protected toolResultText(toolResult: vscode.LanguageModelToolResult): string {
        return toolResult.content
            .filter((part): part is vscode.LanguageModelTextPart => part instanceof vscode.LanguageModelTextPart)
            .map(part => part.value)
            .join('\n');
    }

    /** A tool result whose text begins with "error" — the convention the UML tools use to report failure. */
    protected toolResultIsError(toolResult: vscode.LanguageModelToolResult): boolean {
        return this.toolResultText(toolResult).trimStart().toLowerCase().startsWith('error');
    }

    /** The `filePath` field from a tool input / proposal, if present and non-empty. */
    protected inputFilePath(input: unknown): string | undefined {
        if (input && typeof input === 'object' && 'filePath' in input) {
            const value = (input as { filePath?: unknown }).filePath;
            if (typeof value === 'string' && value.trim()) {
                return value.trim();
            }
        }
        return undefined;
    }

    /**
     * Surface a generation result: stream the tool text, emit a clickable anchor to the generated `.uml`
     * file and open it so the diagram renders. The generation tools only write the file and return text —
     * they never open or anchor it — so without this the run looks like nothing happened.
     */
    protected async announceGeneration(
        stream: vscode.ChatResponseStream,
        filePath: string | undefined,
        toolResult: vscode.LanguageModelToolResult,
        leadingMarkdown = ''
    ): Promise<void> {
        const resultText = this.toolResultText(toolResult);
        if (resultText.trim()) {
            stream.markdown(leadingMarkdown + resultText);
            leadingMarkdown = '';
        }

        if (this.toolResultIsError(toolResult) || !filePath) {
            if (leadingMarkdown) {
                stream.markdown(leadingMarkdown);
            }
            return;
        }

        const normalizedPath = filePath.toLowerCase().endsWith('.uml') ? filePath : `${filePath}.uml`;
        let uri: vscode.Uri | undefined;
        try {
            uri = resolveWorkspacePath(normalizedPath);
        } catch {
            if (leadingMarkdown) {
                stream.markdown(leadingMarkdown);
            }
            return;
        }

        stream.markdown(`${leadingMarkdown}\n\n✔ Opened `);
        stream.anchor(uri, normalizedPath);
        await this.openDiagram(uri);
    }

    /**
     * Open a `.uml` file with its default (bigUML diagram) editor so the generated/edited diagram is visible.
     * The diagram server re-reads the file on open, so an open editor first gets closed to force a fresh load.
     */
    protected async openDiagram(uri: vscode.Uri): Promise<void> {
        try {
            await vscode.commands.executeCommand('vscode.open', uri);
            await this.delay(500);

            const tabs = vscode.window.tabGroups.all
                .flatMap(group => group.tabs)
                .filter(tab => tab.input instanceof vscode.TabInputCustom && tab.input.uri.toString() === uri.toString());
            if (tabs.length > 0) {
                await vscode.window.tabGroups.close(tabs);
                await this.delay(150);
            }
            await vscode.commands.executeCommand('vscode.open', uri);
        } catch (error) {
            this.outputChannel.appendLine(`[big-ai] Could not open diagram: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    protected delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    protected stripLeadingStepHeaderEcho(text: string): string {
        const session = this.sessionManager.session;
        if (!session?.isActive) {
            return text;
        }

        const current = session.steps[session.currentStepIndex]?.definition;
        if (!current) {
            return text;
        }

        const escapedTitle = current.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const stepHeaderPattern = new RegExp(
            `^\\s*(?:\\*\\*)?Step\\s*${current.number}\\s*of\\s*6\\s*[—-]\\s*${escapedTitle}(?:\\*\\*)?\\s*\\n+`,
            'i'
        );

        let normalized = text;
        while (stepHeaderPattern.test(normalized)) {
            normalized = normalized.replace(stepHeaderPattern, '');
        }

        return normalized;
    }

    protected parseCommand(prompt: string, command?: string): ParsedCommand {
        const normalizedPrompt = this.normalizeIncomingPrompt(prompt);

        // VS Code recognizes `interview`/`modify`/`explain` as declared slash commands (see package.json's
        // chatParticipants contribution) and strips the "/word" prefix from `request.prompt` into
        // `request.command` instead — so by the time it reaches here, the prompt no longer starts with
        // "/modify" etc. and the regex matches below would never fire. Check the declared command first;
        // only fall back to regex-matching the raw text for commands VS Code didn't recognize (e.g. `/plan`,
        // which isn't declared) or for text that contains a literal "/command" prefix without having gone
        // through VS Code's own slash-command UI (e.g. a follow-up chip's prompt string).
        if (command === 'interview') {
            if (this.sessionManager.isActive) {
                return { type: 'default', argument: normalizedPrompt };
            }
            return { type: 'interview', argument: normalizedPrompt };
        }
        if (command === 'modify') {
            return { type: 'modify', argument: normalizedPrompt };
        }
        if (command === 'explain') {
            return { type: 'explain', argument: normalizedPrompt };
        }

        const interviewMatch = normalizedPrompt.match(COMMAND_PATTERNS.interview);
        if (interviewMatch) {
            if (this.sessionManager.isActive) {
                return {
                    type: 'default',
                    argument: interviewMatch[1] || ''
                };
            }

            return {
                type: 'interview',
                argument: interviewMatch[1] || ''
            };
        }

        const modifyMatch = normalizedPrompt.match(COMMAND_PATTERNS.modify);
        if (modifyMatch) {
            return {
                type: 'modify',
                argument: modifyMatch[1] || ''
            };
        }

        const explainMatch = normalizedPrompt.match(COMMAND_PATTERNS.explain);
        if (explainMatch) {
            return {
                type: 'explain',
                argument: explainMatch[1] || ''
            };
        }

        const planMatch = normalizedPrompt.match(COMMAND_PATTERNS.plan);
        if (planMatch) {
            return {
                type: 'plan',
                argument: planMatch[1] || ''
            };
        }

        if (!this.sessionManager.isActive && !this.sessionManager.isCompleted) {
            return {
                type: 'interview',
                argument: normalizedPrompt
            };
        }

        if (this.sessionManager.isCompleted) {
            return {
                type: 'interview',
                argument: normalizedPrompt
            };
        }

        return {
            type: 'default',
            argument: normalizedPrompt
        };
    }

    protected provideFollowups(
        result: vscode.ChatResult,
        _context: vscode.ChatContext,
        _token: vscode.CancellationToken
    ): vscode.ChatFollowup[] {
        const commandType = (result.metadata?.command ?? 'default') as string;
        const isInterviewFlow = commandType === 'interview' || commandType === 'default';
        const sessionCompleted = isInterviewFlow && result.metadata?.sessionCompleted === true;
        const sessionActive = isInterviewFlow && result.metadata?.sessionActive === true;
        const stepNumber = (result.metadata?.currentStepNumber as number | undefined) ?? 0;

        const interviewFollowup = (label: string, argument: string): vscode.ChatFollowup => ({
            label,
            prompt: argument,
            command: 'interview'
        });

        const planFollowup = (label: string, argument: string): vscode.ChatFollowup => ({
            label,
            prompt: argument,
            command: 'plan'
        });

        if (sessionCompleted) {
            return [planFollowup('📋 Show progress', '/plan'), interviewFollowup('🔄 Start a new interview', 'create a UML class diagram')];
        }

        if (sessionActive) {
            if (stepNumber === 5) {
                return [
                    planFollowup('📋 Show progress', '/plan'),
                    { prompt: 'yes', label: '✅ Accept summary and create the diagram' },
                    interviewFollowup('✏️ Revise summary', 'Please revise the summary')
                ];
            }

            return [
                planFollowup('📋 Show progress', '/plan'),
                interviewFollowup('Get clarification', 'Can you clarify what you mean?'),
                interviewFollowup('Add context', 'Let me add more context')
            ];
        }

        const awaitingConfirmation = result.metadata?.awaitingConfirmation === true;

        const followupsByCommand: Record<string, vscode.ChatFollowup[]> = {
            interview: awaitingConfirmation
                ? [
                      planFollowup('📋 Show progress', '/plan'),
                      { prompt: 'generate', label: '✅ Accept summary and create the diagram' },
                      interviewFollowup('Revise summary', 'Revise the summary')
                  ]
                : [
                      planFollowup('📋 Show progress', '/plan'),
                      interviewFollowup('▶️ Start interview', 'create a UML class diagram'),
                      interviewFollowup('Add entities', 'Add the main entities'),
                      interviewFollowup('Define relationships', 'Define relationships')
                  ],
            modify: [
                { prompt: '/modify Add another class', label: 'Add a class' },
                { prompt: '/modify Add a relationship', label: 'Add a relationship' },
                { prompt: '/explain Why is this a best practice?', label: 'Learn the principle' }
            ],
            explain: [
                interviewFollowup('See in context', 'How is this applied here?'),
                { prompt: '/explain Show a related concept', label: 'Learn more' },
                { prompt: '/modify Apply this pattern', label: 'Use this pattern' }
            ],
            default: [
                planFollowup('📋 Show progress', '/plan'),
                interviewFollowup('▶️ Start interview', 'create a UML class diagram'),
                { prompt: '/modify How could we improve this?', label: 'Get suggestions' },
                { prompt: '/explain Clarify a concept', label: 'Learn more' }
            ]
        };

        return followupsByCommand[commandType] ?? followupsByCommand['default'];
    }

    protected deriveInterviewState(context: vscode.ChatContext, prompt: string, command: ParsedCommand): InterviewState {
        const pendingProposal = this.findPendingProposal(context);
        const awaitingConfirmation = pendingProposal !== undefined;
        const phase = this.deriveInterviewPhase(context, command, awaitingConfirmation);
        const diagramType = pendingProposal?.diagramType ?? this.deriveDiagramType(context, prompt, command);

        return {
            phase,
            diagramType,
            entities: [],
            relationships: [],
            details: [],
            awaitingConfirmation,
            pendingProposal
        };
    }

    protected findPendingProposal(context: vscode.ChatContext): ProposeDiagramInput | undefined {
        const recentHistory = context.history.slice(-MAX_PROPOSAL_LOOKBACK_TURNS);
        for (const turn of [...recentHistory].reverse()) {
            if (!(turn instanceof vscode.ChatResponseTurn)) {
                continue;
            }
            const metadata = turn.result?.metadata;
            if (!metadata) {
                continue;
            }
            // The most recent decision wins: a generation disarms; a proposal arms.
            if (metadata.generated === true) {
                return undefined;
            }
            if (metadata.proposal) {
                return metadata.proposal as ProposeDiagramInput;
            }
        }
        return undefined;
    }

    protected deriveDiagramType(context: vscode.ChatContext, prompt: string, command: ParsedCommand): 'CLASS' | 'DEPLOYMENT' | 'ACTIVITY' {
        if (this.isActivityIntent(prompt) || (command.type === 'interview' && this.isActivityIntent(command.argument))) {
            return 'ACTIVITY';
        }
        if (this.isDeploymentIntent(prompt) || (command.type === 'interview' && this.isDeploymentIntent(command.argument))) {
            return 'DEPLOYMENT';
        }

        const history = [...context.history].reverse();
        for (const turn of history) {
            let text = '';
            if (turn instanceof vscode.ChatRequestTurn) {
                text = turn.prompt;
            } else if (turn instanceof vscode.ChatResponseTurn) {
                text = this.responseTurnText(turn);
            }

            if (this.isActivityIntent(text)) {
                return 'ACTIVITY';
            }
            if (this.isDeploymentIntent(text)) {
                return 'DEPLOYMENT';
            }
            if (/\bclass\b/i.test(text)) {
                return 'CLASS';
            }
        }

        return 'CLASS';
    }

    protected isDeploymentIntent(text: string): boolean {
        return /\b(deployment|device|execution\s*environment|communication\s*path)\b/i.test(text);
    }

    protected isActivityIntent(text: string): boolean {
        return /\b(activity\s*diagram|activity|workflow|process\s*flow|swimlane|swim\s*lane|control\s*flow|decision|merge|fork|join|initial\s*node|final\s*node)\b/i.test(
            text
        );
    }

    protected generationToolName(diagramType: 'CLASS' | 'DEPLOYMENT' | 'ACTIVITY'): string {
        switch (diagramType) {
            case 'ACTIVITY':
                return UML_TOOL_NAMES.generateActivityDiagram;
            case 'DEPLOYMENT':
                return UML_TOOL_NAMES.generateDeploymentDiagram;
            case 'CLASS':
                return UML_TOOL_NAMES.generateClassDiagram;
        }
    }

    protected deriveInterviewPhase(context: vscode.ChatContext, command: ParsedCommand, awaitingConfirmation: boolean): InterviewPhase {
        if (awaitingConfirmation) {
            return 'confirmation';
        }

        if (context.history.length === 0 || command.type === 'interview') {
            return 'scope';
        }

        return 'details';
    }

    protected buildInterviewStateInstruction(
        history: readonly HistoryTurn[],
        interviewState: InterviewState,
        command: ParsedCommand
    ): string {
        const session = this.sessionManager.session;
        const isInterviewFlow = command.type === 'interview' || command.type === 'default';

        if (!isInterviewFlow || !session?.isActive) {
            return this.buildLegacyInterviewStateInstruction(history, interviewState, command);
        }

        const stepIndex = session.currentStepIndex;
        const step = session.steps[stepIndex];
        const stepNumber = stepIndex + 1;
        const isOnStep5 = stepNumber === 5;
        const isOnStep6 = stepNumber === 6;

        const toolRule = isOnStep6
            ? 'The user confirmed the diagram on the previous turn. Call `biguml-generate-class-diagram` exactly once with all confirmed information. Do not read the file first.'
            : isOnStep5
              ? 'DO NOT call any tools on this turn. Show a diagram-focused summary of what is known so far, say that step 5 cannot be skipped, and ask the user to accept the summary or request a revision.'
              : stepNumber === 2
                ? 'DO NOT call any tools on this turn. Ask exactly one question about the specific class and interface names only. If names are already listed, briefly acknowledge them and ask whether any are abstract or interfaces.'
                : stepNumber === 3
                  ? 'Ask exactly one question about relationships between the classes only. Do not ask for the target .uml file path on this turn. After the user has enough relationship information, call `biguml-complete-interview-step` with stepNumber 3 and a concise summary of the relationships. Do not ask for confirmation or wait for a yes/no answer.'
                  : stepNumber === 4
                    ? 'DO NOT call any tools on this turn. Ask exactly one question about multiplicities and any remaining attributes or operations only. Only ask for the target .uml file path here if it has not already been provided.'
                    : 'DO NOT call any tools on this turn. Ask exactly one question scoped to this step.';

        return `## Interview Session — Step ${stepNumber} of 6

**Current step**: ${step.definition.title}

**Step scope instruction**: ${step.definition.scopeHint}

${this.sessionManager.buildPriorStepsContext()}
**IMPORTANT — do NOT repeat the step number or title in your response.** The extension already displays "Step ${stepNumber} of 6 — ${step.definition.title}" above your message.

**Tools this turn**: ${isOnStep6 ? '`biguml-generate-class-diagram`' : stepNumber === 3 ? '`biguml-complete-interview-step`' : 'none'}

${toolRule}

## Chat History Transcript
Use this as the source of truth for requirements collected so far. Do not invent missing information.
If the last user message is a .uml path, treat it as the target file only — not as attribute or operation detail.
When summarizing step 5, keep it compact and omit file-path discussion unless the user explicitly supplied one.
Short acknowledgements (yes, ok, sure, use those, sounds good) confirm the concrete items proposed in the immediately preceding assistant turn.

${this.buildInterviewTranscript(history)}`;
    }

    protected isConfirmationTurn(context: vscode.ChatContext, prompt: string): boolean {
        if (!this.previousAssistantRequestedGeneration(context)) {
            return false;
        }

        return /\b(generate|create|confirm|confirmed|yes|yep|looks good|go ahead|proceed)\b/i.test(prompt);
    }

    protected looksLikeGenerationSummary(text: string): boolean {
        if (!text) {
            return false;
        }

        const hasSummary = /\bsummary\b/i.test(text) || /^\s*-?\s*diagram file:/im.test(text);
        const invitesGeneration = /reply\b[\s\S]*?\bgenerate\b/i.test(text) || /\bgenerate\b[\s\S]*?\b(diagram|to create)\b/i.test(text);
        const noMissingInfo =
            /missing info(?:rmation)?:?\s*(none|no\b)/i.test(text) || /\b(nothing|no info\w*)\s+(?:is\s+)?missing\b/i.test(text);

        return hasSummary && invitesGeneration && noMissingInfo;
    }

    protected previousAssistantRequestedGeneration(context: vscode.ChatContext): boolean {
        const recentHistory = context.history.slice(-MAX_PROPOSAL_LOOKBACK_TURNS);

        for (const turn of [...recentHistory].reverse()) {
            if (!(turn instanceof vscode.ChatResponseTurn)) {
                continue;
            }

            const recorded = turn.result?.metadata?.presentedSummary;
            if (recorded === true) {
                return true;
            }
            if (recorded === false) {
                continue;
            }

            if (this.looksLikeGenerationSummary(this.responseTurnText(turn))) {
                return true;
            }
        }

        return false;
    }

    protected buildLegacyInterviewStateInstruction(
        history: readonly HistoryTurn[],
        interviewState: InterviewState,
        command: ParsedCommand
    ): string {
        const isModify = command.type === 'modify' && !interviewState.awaitingConfirmation;
        if (isModify) {
            return `## Modify State
- Tools available this turn: readUmlFile, createUmlFile, addNode, addClassMember, removeNode, addRelation, removeRelation

The user wants to change an existing diagram. Apply the change by calling the editing tools — do not just describe it. Pass the active diagram's workspace-relative filePath (shown in Context Information) to every edit tool. If you need the current contents, call biguml-read-uml-file first. Use addNode/addClassMember to add classes and members, removeNode/removeRelation to delete, and addRelation for associations; create all new nodes before relating them. You may batch several independent edits in one turn. Afterwards, briefly state in plain UML terms what you changed (the applied edits are surfaced to the user automatically).

## Chat History Transcript
Use this transcript as the source of truth for requirements. Do not invent missing requirements.

${this.buildInterviewTranscript(history)}`;
        }

        const availableTools = interviewState.awaitingConfirmation
            ? 'readUmlFile, proposeDiagram, confirmGeneration'
            : 'readUmlFile, proposeDiagram';

        const stateRule = interviewState.awaitingConfirmation
            ? 'A complete proposal has already been shown to the user. If the user approves in any wording, call biguml-confirm-generation (no arguments). If the user requests any change, call biguml-propose-diagram again with the corrected specification. Otherwise answer their question or ask one clarifying question. Do not write the summary yourself.'
            : 'No proposal has been shown yet. Continue the interview by asking exactly one clear question, or call biguml-propose-diagram once scope, entities, relationships, details, and the target .uml file are all known. For ACTIVITY diagrams, known details include actions, initial/final nodes, control-flow sequence, decision guards, fork/join parallelism, and optional swimlanes/partitions when applicable. Do not call biguml-confirm-generation. You may offer concrete suggestions, but label them as suggestions the user can accept or change.';

        return `## Interview State
- Phase: ${interviewState.phase}
- Diagram type: ${interviewState.diagramType}
- Awaiting confirmation: ${interviewState.awaitingConfirmation}
- Tools available this turn: ${availableTools}

${stateRule}

## Chat History Transcript
Use this transcript as the source of truth for requirements. Do not invent missing requirements.
If the last user message is a .uml path, treat it as the target diagram file, not as attribute or operation details.
When summarizing step 5, keep it short and do not mention missing information or the file path unless the user explicitly supplied one.
Only generate attributes or operations that the user explicitly named, explicitly accepted from the previous assistant suggestion, or explicitly requested no details.
For ACTIVITY diagrams, do not generate unsupported concepts. Ask to map them to supported activity nodes or omit them before proposing.
Short acknowledgements such as yes, ok, sure, use those, that works, and sounds good confirm the concrete items suggested in the immediately previous assistant turn.

${this.buildInterviewTranscript(history)}`;
    }

    protected buildSystemMessage(
        request: vscode.ChatRequest,
        command: ParsedCommand,
        interviewState: InterviewState,
        history: readonly HistoryTurn[]
    ): string {
        const sessionIsActive = this.sessionManager.session?.isActive === true;

        const commandContexts: Record<string, string> = {
            interview: sessionIsActive
                ? `## Interview Mode — Active Session
                    You are guiding the user through a fixed 6-step UML class diagram interview.
                    Each step has a strict scope — do not ask about content belonging to a later step.
                    Ask exactly one focused question per response.
                    Do not ask for the target .uml file path until the end of the interview, after relationships, multiplicities, attributes, and operations have been collected.
                    Do not offer examples that require multiple answers.`
                : `## Interview Mode Activation
                    You are in INTERVIEW mode. Your goals:
                    1. Gather ${interviewState.diagramType.toLowerCase()} diagram requirements in this order: scope, entities, relationships, details, confirmation.
                    2. Ask exactly one clarifying question per assistant response when information is missing.
                    3. Avoid compound prompts such as multiple bullet questions, "for example" question lists, or several alternatives that all need answers.
                    4. When scope, entities, relationships, details, and the target .uml file are all known, call biguml-propose-diagram with the complete specification. Do not hand-write the summary; the tool renders it.
                    5. After a proposal is shown, call biguml-confirm-generation when the user approves in any wording, or call biguml-propose-diagram again if they request changes.
                    6. Generate only through these tools; never write raw UML, JSON, or a summary yourself.
                    7. For ACTIVITY diagrams, collect actions as OpaqueAction nodes, starts as InitialNode, process completions as ActivityFinalNode or FlowFinalNode, branches as DecisionNode/MergeNode with guarded ControlFlows, parallelism as ForkNode/JoinNode, and swimlanes as ActivityPartition nodes.`,

            modify: `## Modification Mode Activation
                    You are in MODIFY mode. Apply the user's requested changes to the active diagram by calling the editing tools (add/remove nodes, members and relations). Do not just describe the change — make it. Briefly confirm in plain UML terms what you changed.`,

            explain: `## Explanation Mode Activation
                    You are in EXPLAIN mode. Your goals:
                    1. Provide clear, well-structured definitions
                    2. Use concrete examples from UML/OOP
                    3. Show relationships to related concepts
                    4. Provide practical applications
                    5. Make complex topics accessible

                    Format for explanations:
                    - Definition: [clear, concise]
                    - Key Characteristics: [important properties]
                    - Practical Examples: [real-world usage]
                    - Related Concepts: [connections]
                    - When to Use: [applicable scenarios]`,

            default: `## General Conversation Mode
                    Respond helpfully to UML-related questions while maintaining expert-level knowledge.
                    Proactively offer to dive deeper using /interview, /modify, or /explain modes.`
        };

        const modeContext = commandContexts[command.type] ?? commandContexts['default'];

        const referenceInfo = this.describeReferences(request);
        const activeDiagramInfo = this.describeActiveDiagram(request);

        return `${SYSTEM_PROMPT}

---

${modeContext}

---

${this.buildInterviewStateInstruction(history, interviewState, command)}

---

## Context Information
${referenceInfo}
${activeDiagramInfo}

## Reference Handling
All file paths shown above are workspace-relative. When you call any tool that takes a \`filePath\`, pass the workspace-relative path exactly as shown (e.g. \`class_diagram/Model.uml\`) — never an absolute path or one prefixed with the workspace folder name.

When the user attaches references via chat variables such as \`#file:...\` or \`#selection\`, their content is appended to this conversation as messages labeled \`[Attached reference: <name>]\`. Treat that content as authoritative context.

If a message labeled \`[Auto-attached active UML diagram: <path>]\` appears, the user has that diagram open in their editor; use it as context when the request is about "this diagram" or "the current model".`;
    }

    // --- #9 Chat references, active-editor context -------------------------------------------------

    /** The active editor's `.uml` file, if any — used to attach the current diagram as implicit context. */
    protected getActiveUmlUri(): vscode.Uri | undefined {
        const activeTab = vscode.window.tabGroups.activeTabGroup?.activeTab;
        if (!activeTab) {
            return undefined;
        }
        const input = activeTab.input;
        let uri: vscode.Uri | undefined;
        if (input instanceof vscode.TabInputText) {
            uri = input.uri;
        } else if (input instanceof vscode.TabInputCustom) {
            uri = input.uri;
        } else if (input instanceof vscode.TabInputNotebook) {
            uri = input.uri;
        }
        if (!uri || !uri.path.toLowerCase().endsWith('.uml')) {
            return undefined;
        }
        return uri;
    }

    /** Path of a URI relative to the workspace root — the form the tools expect for their `filePath` argument. */
    protected toWorkspaceRelative(uri: vscode.Uri): string {
        return vscode.workspace.asRelativePath(uri, false);
    }

    protected referenceMatchesUri(ref: vscode.ChatPromptReference, uri: vscode.Uri): boolean {
        const v = ref.value;
        if (v instanceof vscode.Uri) {
            return v.toString() === uri.toString();
        }
        if (v instanceof vscode.Location) {
            return v.uri.toString() === uri.toString();
        }
        return false;
    }

    /**
     * References the user explicitly attached, excluding VS Code's implicit `vscode.*` references
     * (e.g. `vscode.customizations.index`), which add thousands of characters of off-topic noise.
     */
    protected userReferences(request: vscode.ChatRequest): readonly vscode.ChatPromptReference[] {
        return request.references.filter(ref => !ref.id.startsWith('vscode.'));
    }

    /** Resolve #file / #selection chat references into labeled context messages. */
    protected async buildReferenceMessages(request: vscode.ChatRequest): Promise<vscode.LanguageModelChatMessage[]> {
        const MAX_REFERENCE_CHARS = 30_000;
        const messages: vscode.LanguageModelChatMessage[] = [];

        for (const ref of this.userReferences(request)) {
            const label = ref.id;
            try {
                const resolved = await this.resolveReferenceContent(ref);
                if (resolved === undefined) {
                    continue;
                }
                const { content, source } = resolved;
                const truncated = content.length > MAX_REFERENCE_CHARS;
                const payload = truncated
                    ? `${content.slice(0, MAX_REFERENCE_CHARS)}\n…[truncated, original length: ${content.length} chars]`
                    : content;
                this.outputChannel.appendLine(
                    `[big-ai] Reference ${label} resolved from ${source} (${content.length} chars${truncated ? ', truncated' : ''})`
                );
                messages.push(
                    vscode.LanguageModelChatMessage.User(`[Attached reference: ${label}${source ? ` (${source})` : ''}]\n${payload}`)
                );
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                this.outputChannel.appendLine(`[big-ai] Reference ${label} failed to resolve: ${message}`);
                messages.push(vscode.LanguageModelChatMessage.User(`[Attached reference: ${label}]\n(Failed to read content: ${message})`));
            }
        }

        return messages;
    }

    protected async resolveReferenceContent(ref: vscode.ChatPromptReference): Promise<{ content: string; source: string } | undefined> {
        const { value } = ref;
        if (value instanceof vscode.Uri) {
            const bytes = await vscode.workspace.fs.readFile(value);
            return { content: new TextDecoder().decode(bytes), source: this.toWorkspaceRelative(value) };
        }
        if (value instanceof vscode.Location) {
            const document = await vscode.workspace.openTextDocument(value.uri);
            return {
                content: document.getText(value.range),
                source: `${this.toWorkspaceRelative(value.uri)}:${value.range.start.line + 1}-${value.range.end.line + 1}`
            };
        }
        if (typeof value === 'string') {
            return { content: value, source: 'inline' };
        }
        return undefined;
    }

    /** Attach the active `.uml` editor as implicit context unless the user already referenced it explicitly. */
    protected async buildAutoAttachMessages(request: vscode.ChatRequest): Promise<vscode.LanguageModelChatMessage[]> {
        const MAX_CONTENT_CHARS = 30_000;
        const activeUri = this.getActiveUmlUri();
        if (!activeUri) {
            return [];
        }
        const alreadyAttached = request.references.some(ref => this.referenceMatchesUri(ref, activeUri));
        if (alreadyAttached) {
            return [];
        }
        try {
            const bytes = await vscode.workspace.fs.readFile(activeUri);
            const content = new TextDecoder().decode(bytes);
            const truncated = content.length > MAX_CONTENT_CHARS;
            const payload = truncated
                ? `${content.slice(0, MAX_CONTENT_CHARS)}\n…[truncated, original length: ${content.length} chars]`
                : content;
            const relPath = this.toWorkspaceRelative(activeUri);
            this.outputChannel.appendLine(
                `[big-ai] Auto-attached active UML file ${activeUri.fsPath} (${content.length} chars${truncated ? ', truncated' : ''})`
            );
            return [
                vscode.LanguageModelChatMessage.User(
                    `[Auto-attached active UML diagram: ${relPath}]\n` +
                        `When calling tools that take a filePath, pass exactly this workspace-relative path: "${relPath}".\n` +
                        payload
                )
            ];
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.outputChannel.appendLine(`[big-ai] Failed to auto-attach active UML file: ${message}`);
            return [];
        }
    }

    protected describeActiveDiagram(request: vscode.ChatRequest): string {
        const activeUri = this.getActiveUmlUri();
        if (!activeUri) {
            return '- No active UML diagram detected in the editor.';
        }
        const alreadyAttached = request.references.some(ref => this.referenceMatchesUri(ref, activeUri));
        const relPath = this.toWorkspaceRelative(activeUri);
        return alreadyAttached
            ? `- Active UML diagram in editor: \`${relPath}\` (also explicitly referenced). Use this workspace-relative path for tool calls.`
            : `- Active UML diagram in editor: \`${relPath}\` (auto-attached below). Use this workspace-relative path for tool calls.`;
    }

    protected describeReferences(request: vscode.ChatRequest): string {
        const references = this.userReferences(request);
        if (references.length === 0) {
            return '- No attached references.';
        }
        const lines = references.map(ref => {
            const label = ref.id;
            const { value } = ref;
            if (value instanceof vscode.Uri) {
                return `- ${label} → file: \`${this.toWorkspaceRelative(value)}\``;
            }
            if (value instanceof vscode.Location) {
                const r = value.range;
                return `- ${label} → selection: \`${this.toWorkspaceRelative(value.uri)}\` lines ${r.start.line + 1}-${r.end.line + 1}`;
            }
            if (typeof value === 'string') {
                return `- ${label} → inline string (${value.length} chars)`;
            }
            return `- ${label} → unsupported reference type`;
        });
        return `Attached references (${references.length}):\n${lines.join('\n')}`;
    }

    dispose(): void {
        this.participant?.dispose();
        this.participant = undefined;
        this.outputChannel.appendLine('[big-ai] Interview Agent participant disposed');
    }
}
