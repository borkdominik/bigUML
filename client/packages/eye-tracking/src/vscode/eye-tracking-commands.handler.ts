/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { inject, injectable, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import { DisposableCollection } from '@eclipse-glsp/protocol';
import type { Disposable } from '@eclipse-glsp/protocol';
import { TYPES as EYE_TYPES } from './eye-tracking.types.js';
import type { InteractionTracker } from './interaction-tracker.service.js';
import type { InteractionReplayService } from './interaction-replay.service.js';

@injectable()
export class EyeTrackingCommandHandler implements Disposable {
    @inject(EYE_TYPES.InteractionTracker)
    protected readonly interactionTracker: InteractionTracker;
    
    @inject(EYE_TYPES.InteractionReplayService)
    protected readonly replayService: InteractionReplayService;

    private readonly toDispose = new DisposableCollection();

    @postConstruct()
    protected init(): void {
        this.registerCommands();
    }

    private registerCommands(): void {
        // Start tracking command
        this.toDispose.push(
            vscode.commands.registerCommand('bigUML.startInteractionTracking', async () => {
                this.interactionTracker.startSession();
            })
        );

        // Stop tracking command
        this.toDispose.push(
            vscode.commands.registerCommand('bigUML.stopInteractionTracking', () => {
                this.interactionTracker.stopSession();
            })
        );

        // Replay from file command
        this.toDispose.push(
            vscode.commands.registerCommand('bigUML.replayInteractionSession', async () => {
                await this.showReplayDialog();
            })
        );

        // Show session summary command
        this.toDispose.push(
            vscode.commands.registerCommand('bigUML.showSessionSummary', async () => {
                await this.showSessionSummary();
            })
        );
    }

    private async showReplayDialog(): Promise<void> {
        // Warning about empty diagram requirement
        const proceed = await vscode.window.showWarningMessage(
            'Replay requires an empty UML diagram. Please ensure you have a new, empty diagram open before continuing.',
            { modal: true },
            'Continue',
            'Cancel'
        );

        if (proceed !== 'Continue') {
            return;
        }

        // Let user select a CSV file
        const fileUri = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            filters: {
                'CSV Files': ['csv']
            },
            title: 'Select Interaction Session File'
        });

        if (!fileUri || fileUri.length === 0) {
            return;
        }

        const filePath = fileUri[0].fsPath;

        // Get session summary first
        const summary = this.replayService.getSessionSummary(filePath);
        if (!summary) {
            vscode.window.showErrorMessage('Failed to read session file');
            return;
        }

        // Show summary and ask for replay options
        const durationSeconds = Math.round(summary.duration / 1000);
        const eventTypeSummary = Object.entries(summary.eventTypes)
            .map(([type, count]) => `${type}: ${count}`)
            .join(', ');

        const message = `Session: ${summary.sessionId}\n` +
            `Events: ${summary.totalEvents}\n` +
            `Duration: ${durationSeconds}s\n` +
            `Types: ${eventTypeSummary}\n\n` +
            `Choose replay speed:`;

        const speedChoice = await vscode.window.showQuickPick(
            [
                { label: 'Instant (0x)', description: 'Replay all events immediately', value: 0 },
                { label: 'Fast (5x)', description: '5x faster than recorded', value: 5 },
                { label: 'Normal (1x)', description: 'Real-time replay', value: 1 },
                { label: 'Slow (0.5x)', description: '0.5x slower than recorded', value: 0.5 }
            ],
            {
                placeHolder: message,
                title: 'Replay Interaction Session'
            }
        );

        if (!speedChoice) {
            return;
        }

        // Start replay
        await this.replayService.replayFromFile(filePath, {
            speed: speedChoice.value
        });
    }

    private async showSessionSummary(): Promise<void> {
        const fileUri = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            filters: {
                'CSV Files': ['csv']
            },
            title: 'Select Interaction Session File'
        });

        if (!fileUri || fileUri.length === 0) {
            return;
        }

        const filePath = fileUri[0].fsPath;
        const summary = this.replayService.getSessionSummary(filePath);

        if (!summary) {
            vscode.window.showErrorMessage('Failed to read session file');
            return;
        }

        const durationSeconds = Math.round(summary.duration / 1000);
        const eventTypeSummary = Object.entries(summary.eventTypes)
            .map(([type, count]) => `  - ${type}: ${count}`)
            .join('\n');

        const message = 
            `**Session Summary**\n\n` +
            `**Session ID:** ${summary.sessionId}\n` +
            `**Total Events:** ${summary.totalEvents}\n` +
            `**Duration:** ${durationSeconds} seconds\n` +
            `**Start Time:** ${summary.startTime.toLocaleString()}\n` +
            `**End Time:** ${summary.endTime.toLocaleString()}\n\n` +
            `**Event Types:**\n${eventTypeSummary}`;

        vscode.window.showInformationMessage(message, { modal: true });
    }

    dispose(): void {
        this.toDispose.dispose();
    }
}
