/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { ModelPatchCommand } from '@borkdominik-biguml/uml-glsp-server/vscode';
import type { DiagramModelState } from '@borkdominik-biguml/uml-glsp-server/vscode';
import { CommandStack, ModelState, ModelSubmissionHandler, type ActionHandler, type MaybePromise } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { applyExactReplacement, applyReplacement } from '../common/replace-semantics.js';
import { ReplaceActionResponse, RequestReplaceAction, type ReplaceResult } from '../common/replace.action.js';
import { astFieldOf, isTokenProperty, SPEC_BY_KEY } from '../common/search-filter-spec.js';

const SAFE_PROPERTY_RE = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

@injectable()
export class ReplaceActionHandler implements ActionHandler {
    actionKinds = [RequestReplaceAction.KIND];

    @inject(ModelState)
    readonly modelState: DiagramModelState;

    @inject(ModelSubmissionHandler)
    protected readonly modelSubmissionHandler: ModelSubmissionHandler;

    @inject(CommandStack)
    protected readonly commandStack: CommandStack;

    execute(action: RequestReplaceAction): MaybePromise<any[]> {
        if (RequestReplaceAction.is(action)) {
            return this.handleReplace(action);
        }
        return [];
    }

    protected async handleReplace(action: RequestReplaceAction): Promise<any[]> {
        const property = action.property ?? 'name';

        if (!SAFE_PROPERTY_RE.test(property)) {
            return [ReplaceActionResponse.create({ ok: false, error: `Invalid property name: "${property}"` })];
        }

        if (action.searchPattern === '') {
            return [ReplaceActionResponse.create({ ok: false, error: 'Find pattern must not be empty.' })];
        }

        const astField = astFieldOf(property);
        const isBoolean = SPEC_BY_KEY.get(property)?.valueType === 'boolean';
        const exactMatch = isTokenProperty(property);

        const patchOps: { op: 'replace'; path: string; value: string | boolean }[] = [];
        const results: ReplaceResult[] = [];

        for (const id of action.elementIds) {
            const node = this.modelState.index.findIdElement(id);
            if (!node) {
                results.push({ id, property, success: false, changed: false, error: 'Element not found' });
                continue;
            }

            const path = this.modelState.index.findPath(id);
            if (!path) {
                results.push({ id, property, success: false, changed: false, error: 'JSON path not found' });
                continue;
            }

            const rawValue = (node as any)[astField];

            if (isBoolean) {
                if (typeof rawValue !== 'boolean') {
                    results.push({
                        id,
                        property,
                        oldValue: String(rawValue ?? ''),
                        success: false,
                        changed: false,
                        error: `Property "${property}" is not a boolean`
                    });
                    continue;
                }

                const oldValue = String(rawValue);
                const newValue = applyExactReplacement(oldValue, action.searchPattern, action.replaceWith, action.caseSensitive);
                if (newValue === oldValue) {
                    results.push({ id, property, oldValue, newValue, success: true, changed: false });
                    continue;
                }
                if (newValue !== 'true' && newValue !== 'false') {
                    results.push({
                        id,
                        property,
                        oldValue,
                        newValue,
                        success: false,
                        changed: false,
                        error: `Invalid boolean value: "${newValue}"`
                    });
                    continue;
                }

                patchOps.push({ op: 'replace', path: path + '/' + astField, value: newValue === 'true' });
                results.push({ id, property, oldValue, newValue, success: true, changed: true });
                continue;
            }

            if (typeof rawValue !== 'string') {
                results.push({
                    id,
                    property,
                    oldValue: String(rawValue ?? ''),
                    success: false,
                    changed: false,
                    error: `Property "${property}" is not a string`
                });
                continue;
            }

            const oldValue = rawValue;
            const newValue = exactMatch
                ? applyExactReplacement(oldValue, action.searchPattern, action.replaceWith, action.caseSensitive)
                : applyReplacement(oldValue, action.searchPattern, action.replaceWith, action.caseSensitive);
            if (newValue === oldValue) {
                results.push({ id, property, oldValue, newValue, success: true, changed: false });
                continue;
            }

            // Don't allow a replace to wipe a value: empty names break the
            // textual model and there is no legitimate "clear" use case here.
            // If one ever appears, add an explicit clearValue flag instead.
            if (newValue.trim() === '') {
                results.push({
                    id,
                    property,
                    oldValue,
                    newValue,
                    success: false,
                    changed: false,
                    error: 'Replacement would clear the value'
                });
                continue;
            }

            patchOps.push({ op: 'replace', path: path + '/' + astField, value: newValue });
            results.push({ id, property, oldValue, newValue, success: true, changed: true });
        }

        if (patchOps.length > 0) {
            const cmd = new ModelPatchCommand(this.modelState, JSON.stringify(patchOps));
            try {
                // Execute via the command stack so the patch is recorded for undo/redo.
                // Bypassing the stack (e.g. calling cmd.execute() directly) leaves the
                // model server's history populated but the GLSP undo handler has nothing
                // to pop, so the user-facing Undo button effectively no-ops.
                await this.commandStack.execute(cmd);
            } catch (e) {
                const message = e instanceof Error ? e.message : String(e);
                return [ReplaceActionResponse.create({ ok: false, error: `Replace failed: ${message}` })];
            }
            // Submit with reason 'operation': the VS Code connector only fires
            // onDidChangeCustomDocument (which feeds VS Code's undo stack and the
            // dirty indicator) for that reason. Without it, replaces are invisible
            // to Ctrl+Z and the document never shows as modified.
            const submissionActions = await this.modelSubmissionHandler.submitModel('operation');
            return [...submissionActions, ReplaceActionResponse.create({ ok: true, results })];
        }

        return [ReplaceActionResponse.create({ ok: true, results })];
    }
}
