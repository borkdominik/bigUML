/*********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

export interface InterviewStepDefinition {
    readonly number: number;
    readonly title: string;
    readonly scopeHint: string;
    readonly policy: InterviewStepPolicy;
}

export type StepAdvancementSignal = 'entity-list' | 'class-declaration' | 'relationship' | 'multiplicity-or-details' | 'confirmation';

export type StepSummaryMode = 'none' | 'diagram';

export interface InterviewStepPolicy {
    readonly canSkip: boolean;
    readonly advancementSignals: readonly StepAdvancementSignal[];
    readonly summaryMode: StepSummaryMode;
    readonly skipBlockedMessage?: string;
}

export const INTERVIEW_STEP_DEFINITIONS: readonly InterviewStepDefinition[] = [
    {
        number: 1,
        title: 'Define the UML scope and main entities',
        scopeHint:
            'Ask exactly one question about the name or purpose of the system and what its top-level entities are. ' +
            'Do NOT ask about specific class details, relationships, attributes, or operations yet.',
        policy: {
            canSkip: false,
            advancementSignals: ['entity-list'],
            summaryMode: 'none',
            skipBlockedMessage: 'Step 1 cannot be skipped. Please provide the system scope and main entities first.'
        }
    },
    {
        number: 2,
        title: 'Model core classes and interfaces',
        scopeHint:
            'Ask exactly one question to clarify the specific class and interface names and whether any are abstract or interfaces. ' +
            'Do NOT ask about relationships, multiplicities, or attributes yet.',
        policy: {
            canSkip: true,
            advancementSignals: ['class-declaration'],
            summaryMode: 'none'
        }
    },
    {
        number: 3,
        title: 'Specify relationships between classes',
        scopeHint:
            'Ask exactly one question about how the classes relate to each other (inheritance, composition, aggregation, association, dependency, etc.). ' +
            'Do NOT ask about multiplicities or attribute details yet.',
        policy: {
            canSkip: true,
            advancementSignals: ['relationship', 'multiplicity-or-details'],
            summaryMode: 'none'
        }
    },
    {
        number: 4,
        title: 'Refine associations and multiplicities',
        scopeHint:
            'Ask exactly one question to clarify multiplicity values (e.g. 1..*, 0..1) and any remaining attribute or operation details the user wishes to add. ' +
            'Do NOT revisit scope, class names, or relationship types already collected.',
        policy: {
            canSkip: true,
            advancementSignals: ['multiplicity-or-details'],
            summaryMode: 'none'
        }
    },
    {
        number: 5,
        title: 'Confirm and create the diagram',
        scopeHint:
            'List ALL collected information (scope, entities, classes, relationships, multiplicities, attributes) in a concise summary table or list. ' +
            'Then ask exactly: "Shall I create the diagram with these elements?" ' +
            'Do NOT call any tools on this turn. Do not request additional information.',
        policy: {
            canSkip: false,
            advancementSignals: ['confirmation'],
            summaryMode: 'diagram',
            skipBlockedMessage: 'Step 5 cannot be skipped. Please confirm this summary or ask for a revision before creating the diagram.'
        }
    },
    {
        number: 6,
        title: 'Review and next steps',
        scopeHint:
            'The diagram has just been created by the extension. Briefly acknowledge the created elements, confirm what was built, and suggest 2–3 possible next steps (add more details, explore other diagram types, add class members, etc.). ' +
            'Keep the response concise and encouraging.',
        policy: {
            canSkip: false,
            advancementSignals: [],
            summaryMode: 'none'
        }
    }
];

export interface StepRecord {
    readonly definition: InterviewStepDefinition;
    completed: boolean;
    summary: string | undefined;
}

export interface InterviewSession {
    isActive: boolean;
    isCompleted: boolean;
    currentStepIndex: number;
    steps: StepRecord[];
    firstResponseSent: boolean;
    autoCompletedSteps: number[];
    draft: DiagramDraft;
    /**
     * `context.history.length` at the moment this session started. Chat history from before this index
     * belongs to a previous (possibly already-completed) interview and must not be fed back to the model as
     * if it were part of this one.
     */
    historyStartIndex: number;
}

export interface DiagramDraft {
    scope?: string;
    entities: string[];
    relationships: string[];
    details: string[];
    targetFile?: string;
    pendingRequestedChange?: string;
}

export interface StepParseResult {
    readonly normalizedInput: string;
    readonly summary: string;
    readonly applied: boolean;
}

export class InterviewSessionManager {
    private _session: InterviewSession | null = null;

    get session(): InterviewSession | null {
        return this._session;
    }

    get isActive(): boolean {
        return this._session?.isActive === true;
    }

    get isCompleted(): boolean {
        return this._session?.isCompleted === true;
    }

    get currentStepNumber(): number {
        return (this._session?.currentStepIndex ?? -1) + 1;
    }

    get currentStep(): StepRecord | null {
        if (!this._session) return null;
        return this._session.steps[this._session.currentStepIndex];
    }

    startNew(historyStartIndex = 0): InterviewSession {
        this._session = {
            isActive: true,
            isCompleted: false,
            currentStepIndex: 0,
            steps: INTERVIEW_STEP_DEFINITIONS.map(def => ({
                definition: def,
                completed: false,
                summary: undefined
            })),
            firstResponseSent: false,
            autoCompletedSteps: [],
            draft: {
                targetFile: undefined,
                entities: [],
                relationships: [],
                details: []
            },
            historyStartIndex
        };
        return this._session;
    }

    setAutoCompletedSteps(steps: number[]): void {
        if (this._session) {
            this._session.autoCompletedSteps = steps;
        }
    }

    markFirstResponseSent(): void {
        if (this._session) {
            this._session.firstResponseSent = true;
        }
    }

    completeCurrentStep(summary: string): void {
        if (!this._session || this._session.isCompleted) return;
        const idx = this._session.currentStepIndex;
        this._session.steps[idx].completed = true;
        this._session.steps[idx].summary = summary;
        this.updateDraftFromStep(idx + 1, summary);
    }

    applyStepInput(stepNumber: number, prompt: string): StepParseResult {
        const normalizedInput = this.normalizeStepInput(prompt);
        if (!this._session || !normalizedInput) {
            return {
                normalizedInput,
                summary: normalizedInput,
                applied: false
            };
        }

        const draft = this._session.draft;
        let applied = false;

        if (stepNumber === 1) {
            const inferredScope = this.inferScopeFromPrompt(normalizedInput);
            if (inferredScope) {
                draft.scope = inferredScope;
                applied = true;
            }

            const entities = this.extractEntityCandidates(normalizedInput);
            if (entities.length > 0) {
                this.mergeUnique(draft.entities, entities);
                applied = true;
            }
        }

        if (stepNumber === 2) {
            const entities = this.extractEntityCandidates(normalizedInput);
            if (entities.length > 0) {
                this.mergeUnique(draft.entities, entities);
                applied = true;
            }
        }

        if (stepNumber === 3) {
            const relationships = this.extractRelationshipCandidates(normalizedInput);
            if (relationships.length > 0) {
                this.mergeUnique(draft.relationships, relationships);
                applied = true;
            }

            const entities = this.extractEntityCandidates(normalizedInput);
            if (entities.length > 0) {
                this.mergeUnique(draft.entities, entities);
                applied = true;
            }
        }

        if (stepNumber === 4) {
            const details = this.extractDetailCandidates(normalizedInput);
            if (details.length > 0) {
                this.mergeUnique(draft.details, details);
                applied = true;
            }

            const targetFile = this.extractTargetDiagramFilePath(normalizedInput);
            if (targetFile) {
                draft.targetFile = targetFile;
                applied = true;
            }
        }

        return {
            normalizedInput,
            summary: normalizedInput,
            applied
        };
    }

    applyRevisionToDraft(change: string): void {
        if (!this._session) return;
        const normalized = change.trim();
        if (!normalized) return;

        const draft = this._session.draft;
        draft.pendingRequestedChange = normalized;
        let consumed = false;

        const requestedClasses = this.extractRequestedClasses(normalized);
        if (requestedClasses.length > 0) {
            this.mergeUnique(draft.entities, requestedClasses);
            consumed = true;
        }

        if (this.looksRelationshipLike(normalized)) {
            this.mergeUnique(draft.relationships, [normalized]);
            consumed = true;
        }

        if (this.isDetailLikeChange(normalized)) {
            this.mergeUnique(draft.details, [normalized]);
            consumed = true;
        }

        if (consumed) {
            draft.pendingRequestedChange = undefined;
        }
    }

    advanceToNextStep(): void {
        if (!this._session || this._session.isCompleted) return;
        if (this._session.currentStepIndex < 5) {
            this._session.currentStepIndex++;
        }
    }

    markComplete(): void {
        if (!this._session) return;
        this._session.isCompleted = true;
        this._session.isActive = false;
    }

    buildStepHeader(): string {
        if (!this._session) return '';
        const step = this._session.steps[this._session.currentStepIndex];
        const header = `**Step ${step.definition.number} of 6 — ${step.definition.title}**\n\n`;

        const auto = this._session.autoCompletedSteps;
        if (auto.length > 1 && !this._session.firstResponseSent) {
            const lastAuto = auto[auto.length - 1];
            return header + `*Steps 1–${lastAuto} detected from your initial message — jumping ahead.*\n\n`;
        }
        return header;
    }

    buildProgressSummary(): string {
        if (!this._session) return '';

        const session = this._session;
        const currentStep = session.steps[session.currentStepIndex] ?? null;
        const completedSteps = session.steps.filter(step => step.completed && step.summary);
        const remainingSteps = session.steps.filter(step => !step.completed);

        const lines: string[] = ['## Progress Overview', ''];

        if (session.isCompleted) {
            lines.push('**Status:** Interview complete. The diagram has been created.');
        } else if (currentStep) {
            lines.push(`**Current step:** Step ${currentStep.definition.number} of 6 — ${currentStep.definition.title}`);
        }

        lines.push('');
        lines.push('**Completed steps**');
        if (completedSteps.length === 0) {
            lines.push('- None yet');
        } else {
            for (const step of completedSteps) {
                lines.push(`- Step ${step.definition.number}: ${step.definition.title} — ${step.summary}`);
            }
        }

        if (!session.isCompleted) {
            const laterSteps = remainingSteps.filter(step => currentStep && step.definition.number > currentStep.definition.number);
            if (laterSteps.length > 0) {
                lines.push('');
                lines.push('**Remaining steps**');
                for (const step of laterSteps) {
                    lines.push(`- Step ${step.definition.number}: ${step.definition.title}`);
                }
            }

            if (currentStep && currentStep.definition.number < 6) {
                const nextStep = session.steps[currentStep.definition.number];
                if (nextStep) {
                    lines.push('');
                    lines.push(`**Next step after this:** Step ${nextStep.definition.number} — ${nextStep.definition.title}`);
                }
            }
        }

        return `${lines.join('\n')}\n\n`;
    }

    private isDetailLikeChange(text: string): boolean {
        return /\b(\d+\s*\.\.\s*\d+|\d+\s*\.\.\s*\*|0\s*\.\.\s*1|1\s*\.\.\s*\*|0\s*\.\.\s*\*|one\s*to\s*many|many\s*to\s*one|many\s*to\s*many|one\s*to\s*one|multiplicity|attribute|attributes|operation|operations|relation|relationship|associat|aggregat|composit|inherit|teach|enroll|link)\b/i.test(
            text
        );
    }

    private extractNamedTypes(text: string): string[] {
        const matches = text.match(/\b[A-Z][A-Za-z0-9_]*\b/g) ?? [];
        const ignored = new Set(['Step', 'Define', 'Model', 'Specify', 'Refine', 'Confirm', 'Review', 'Shall', 'UML']);
        return matches.filter(name => !ignored.has(name));
    }

    private normalizeStepInput(text: string): string {
        return text.trim().replace(/\s+/g, ' ');
    }

    private inferScopeFromPrompt(text: string): string {
        const stripped = text
            .replace(/^create\s+(?:a\s+)?uml(?:\s+class)?\s+diagram\s+for\s+/i, '')
            .replace(/^create\s+(?:a\s+)?diagram\s+for\s+/i, '')
            .replace(/^diagram\s+for\s+/i, '')
            .trim();

        if (!stripped) {
            return '';
        }

        return stripped;
    }

    private extractEntityCandidates(text: string): string[] {
        const namedTypes = this.extractNamedTypes(text);
        if (namedTypes.length > 0) {
            return namedTypes;
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

        return (
            text
                .toLowerCase()
                .match(/\b[a-z][a-z0-9_-]*\b/g)
                ?.filter(word => !stopWords.has(word))
                .map(word => word.charAt(0).toUpperCase() + word.slice(1)) ?? []
        );
    }

    private extractRelationshipCandidates(text: string): string[] {
        const clauses = text
            .split(/[.;\n]/)
            .map(part => part.trim())
            .filter(Boolean)
            .filter(part => this.looksRelationshipLike(part));

        return clauses.length > 0 ? clauses : this.looksRelationshipLike(text) ? [text] : [];
    }

    private extractDetailCandidates(text: string): string[] {
        const details = text
            .split(/,|\band\b|\b&\b/i)
            .map(part => part.trim())
            .filter(Boolean)
            .filter(part => this.isDetailLikeChange(part));

        return details.length > 0 ? details : this.isDetailLikeChange(text) ? [text] : [];
    }

    private mergeUnique(target: string[], additions: string[]): void {
        for (const item of additions) {
            const normalized = item.trim();
            if (!normalized) {
                continue;
            }
            const exists = target.some(existing => existing.toLowerCase() === normalized.toLowerCase());
            if (!exists) {
                target.push(normalized);
            }
        }
    }

    private looksRelationshipLike(text: string): boolean {
        return /\b(relationship|relates?|association|aggregation|composition|inheritance|extends|implements|depends|uses|contains|has|teaches|enrolls?|links?)\b/i.test(
            text
        );
    }

    private updateDraftFromStep(stepNumber: number, summary: string): void {
        if (!this._session) return;

        const text = summary.trim();
        if (!text) {
            return;
        }

        const draft = this._session.draft;

        if (stepNumber === 1) {
            const resolvedScope = this.resolveScope(text);
            if (resolvedScope !== 'Not yet specified') {
                draft.scope = resolvedScope;
            }
            return;
        }

        if (stepNumber === 2) {
            this.mergeUnique(draft.entities, this.extractNamedTypes(text));
            return;
        }

        if (stepNumber === 3) {
            this.mergeUnique(draft.entities, this.extractNamedTypes(text));
            this.mergeUnique(draft.relationships, [text]);
            return;
        }

        if (stepNumber === 4) {
            this.mergeUnique(draft.details, [text]);
            return;
        }

        if (stepNumber >= 5) {
            if (this.looksRelationshipLike(text)) {
                this.mergeUnique(draft.relationships, [text]);
            }
            if (this.isDetailLikeChange(text)) {
                this.mergeUnique(draft.details, [text]);
            }
            this.mergeUnique(draft.entities, this.extractNamedTypes(text));
        }
    }

    private extractRequestedClasses(change: string): string[] {
        const match = change.match(/\badd\b[\s\w]*?\bclass(?:es)?\b\s+([^.!?\n]+)/i);
        if (!match?.[1]) {
            return [];
        }

        return match[1]
            .split(/,|\band\b|\b&\b/i)
            .map(part => part.trim())
            .filter(Boolean)
            .map(part => part.replace(/[^A-Za-z0-9_\s-]/g, ''))
            .map(part => part.split(/\s+/)[0])
            .filter(Boolean)
            .map(name => name.charAt(0).toUpperCase() + name.slice(1));
    }

    private resolveScope(step1Summary: string): string {
        const normalized = step1Summary.trim();
        if (!normalized || normalized === 'Not yet specified') {
            return 'Not yet specified';
        }

        if (
            /\b(system|platform|application|app|domain|portal|service|registration|management|booking|library|university|school)\b/i.test(
                normalized
            )
        ) {
            return normalized;
        }

        return 'Not yet specified';
    }

    private resolveEntities(
        step2Summary: string,
        step3Summary: string,
        latestRequestedChange?: string
    ): { text: string; consumed: boolean } {
        const entities = new Set<string>();

        for (const name of this.extractNamedTypes(step2Summary)) {
            entities.add(name);
        }
        for (const name of this.extractNamedTypes(step3Summary)) {
            entities.add(name);
        }

        const requested = latestRequestedChange ? this.extractRequestedClasses(latestRequestedChange) : [];
        for (const name of requested) {
            entities.add(name);
        }

        if (entities.size === 0) {
            return { text: 'Not yet specified', consumed: false };
        }

        return { text: [...entities].join(', '), consumed: requested.length > 0 };
    }

    private resolveRelationships(step3Summary: string, latestRequestedChange?: string): { text: string; consumed: boolean } {
        const base = step3Summary.trim() || 'Not yet specified';
        const change = latestRequestedChange?.trim();
        if (!change) {
            return { text: base, consumed: false };
        }

        const looksRelationshipLike = this.looksRelationshipLike(change);
        if (!looksRelationshipLike) {
            return { text: base, consumed: false };
        }

        if (base === 'Not yet specified') {
            return { text: change, consumed: true };
        }

        if (base.toLowerCase().includes(change.toLowerCase())) {
            return { text: base, consumed: true };
        }

        return { text: `${base}; ${change}`, consumed: true };
    }

    buildDiagramSummary(): string {
        if (!this._session) return '';

        const session = this._session;
        const completedSteps = session.steps.filter(step => step.completed && step.summary);
        const draft = session.draft;

        const stepSummary = (number: number): string => {
            const summary = session.steps[number - 1]?.summary?.trim();
            return summary && summary.length > 0 ? summary : 'Not yet specified';
        };

        const lines: string[] = ['**Step 5 of 6 — Confirm and create the diagram**', ''];
        const fallbackScope = this.resolveScope(stepSummary(1));
        const fallbackEntities = this.resolveEntities(stepSummary(2), stepSummary(3));
        const fallbackRelationships = this.resolveRelationships(stepSummary(3));
        const fallbackDetails = stepSummary(4);

        const scope = draft.scope?.trim() || fallbackScope;
        const entities = draft.entities.length > 0 ? draft.entities.join(', ') : fallbackEntities.text;
        const relationships = draft.relationships.length > 0 ? draft.relationships.join('; ') : fallbackRelationships.text;
        const details = draft.details.length > 0 ? draft.details.join('; ') : fallbackDetails;

        lines.push(`**Scope:** ${scope || 'Not yet specified'}`);
        lines.push(`**Entities / classes:** ${entities || 'Not yet specified'}`);
        lines.push(`**Relationships:** ${relationships || 'Not yet specified'}`);
        lines.push(`**Multiplicity / details:** ${details || 'Not yet specified'}`);

        if (draft.targetFile) {
            lines.push(`**Target file:** ${draft.targetFile}`);
        }

        if (draft.pendingRequestedChange) {
            lines.push(`**Latest requested change:** ${draft.pendingRequestedChange}`);
        }

        if (completedSteps.length > 4) {
            const laterSummaries = completedSteps
                .filter(step => step.definition.number >= 5)
                .map(step => `- Step ${step.definition.number}: ${step.summary}`);

            if (laterSummaries.length > 0) {
                lines.push('');
                lines.push('**Additional confirmed details:**');
                lines.push(...laterSummaries);
            }
        }

        return `${lines.join('\n')}\n\n`;
    }

    buildPlanTable(): string {
        return this.buildProgressSummary();
    }

    buildCompletionTable(): string {
        return this.buildProgressSummary();
    }

    private extractTargetDiagramFilePath(text: string): string | undefined {
        const match = text.match(/\b([^\s,;:()]+\.uml)\b/i);
        return match?.[1]?.trim();
    }

    buildPriorStepsContext(): string {
        if (!this._session) return '';
        const completed = this._session.steps.filter(s => s.completed && s.summary);
        if (completed.length === 0) return '';

        const lines = completed.map(step => `• Step ${step.definition.number} (${step.definition.title}): ${step.summary}`);
        return `## Prior Steps Summary\n\n${lines.join('\n')}\n\n`;
    }

    isConfirmationAnswer(prompt: string): boolean {
        return /\b(generate|create|confirm|confirmed|yes|yep|sure|looks good|go ahead|proceed|do it|make it|ok|okay)\b/i.test(prompt);
    }
}
