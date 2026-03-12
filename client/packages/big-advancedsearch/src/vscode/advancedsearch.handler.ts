/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import {
    EXPERIMENTAL_TYPES,
    TYPES,
    type ActionDispatcher,
    type ActionListener,
    type Disposable,
    type ExperimentalGLSPServerModelState
} from '@borkdominik-biguml/big-vscode-integration/vscode';

import { DisposableCollection } from '@eclipse-glsp/protocol';
import { inject, injectable, postConstruct } from 'inversify';
import { AdvancedSearchActionResponse, RequestAdvancedSearchAction } from '../common/advancedsearch.action.js';

import type { SearchResult } from '../common/searchresult.js';
import type { IMatcher } from './matchers/IMatcher.js';

import { SelectAllAction } from '@eclipse-glsp/protocol';
import { SelectAction } from '@eclipse-glsp/vscode-integration';
import { HighlightElementActionResponse, RequestHighlightElementAction } from '../common/highlight.action.js';

import { ClassDiagramMatcher } from './matchers/classmatcher.js';
import { CommunicationDiagramMatcher } from './matchers/communicationmatcher.js';
// import { DeploymentDiagramMatcher } from './matchers/deploymentmatcher.js';
import { ActivityDiagramMatcher } from './matchers/activitymatcher.js';
import { InformationFlowDiagramMatcher } from './matchers/informationflowmatcher.js';
import { PackageDiagramMatcher } from './matchers/packagematcher.js';
import { StateMachineDiagramMatcher } from './matchers/statemachinematcher.js';
import { UseCaseDiagramMatcher } from './matchers/usecasematcher.js';

@injectable()
export class AdvancedSearchActionHandler implements Disposable {
    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;

    @inject(TYPES.ActionListener)
    protected readonly actionListener: ActionListener;

    @inject(EXPERIMENTAL_TYPES.GLSPServerModelState)
    protected readonly modelState: ExperimentalGLSPServerModelState;

    private readonly toDispose = new DisposableCollection();

    private readonly matchers: IMatcher[] = [
        new ClassDiagramMatcher(),
        new UseCaseDiagramMatcher(),
        new PackageDiagramMatcher(),
        new InformationFlowDiagramMatcher(),
        new CommunicationDiagramMatcher(),
        new StateMachineDiagramMatcher(),
        new ActivityDiagramMatcher()
        // new DeploymentDiagramMatcher()
    ];

    @postConstruct()
    protected init(): void {
        this.toDispose.push(
            this.actionListener.handleVSCodeRequest<RequestAdvancedSearchAction>(RequestAdvancedSearchAction.KIND, request => {
                const model = this.modelState.getModelState();

                const results: SearchResult[] = [];

                if (model) {
                    const rawQuery = request.action.query.trim();

                    let type: string | undefined;
                    let pattern: string | undefined;

                    if (rawQuery.includes(':')) {
                        const [rawType, rawPattern] = rawQuery.split(':', 2);
                        type = rawType?.trim().toLowerCase() || undefined;
                        pattern = rawPattern?.trim().toLowerCase() || undefined;
                    } else {
                        type = undefined;
                        pattern = rawQuery.toLowerCase();
                    }

                    const applicableMatchers = !type ? this.matchers : this.matchers.filter(m => m.supportsPartial?.(type as string));

                    for (const matcher of applicableMatchers) {
                        results.push(...matcher.match(model));
                    }

                    const filtered = results.filter(item => {
                        const itemType = item.type.toLowerCase();
                        const name = item.name?.toLowerCase() ?? '';
                        const details = item.details?.toLowerCase() ?? '';
                        const parentName = item.parentName?.toLowerCase() ?? '';

                        const matchesType = !type || itemType.includes(type);

                        const matchesPattern =
                            !pattern || name.includes(pattern) || details.includes(pattern) || parentName.includes(pattern);

                        return matchesType && matchesPattern;
                    });

                    const unique = new Map<string, SearchResult>();

                    for (const item of filtered) {
                        const key = `${item.id}-${item.type}`;
                        const existing = unique.get(key);

                        if (!existing) {
                            unique.set(key, item);
                            continue;
                        }

                        const existingName = existing.name ?? '';
                        const candidateName = item.name ?? '';

                        const existingIsUnknown = existingName.includes('(unknown)');
                        const candidateIsUnknown = candidateName.includes('(unknown)');

                        if (existingIsUnknown && !candidateIsUnknown) {
                            unique.set(key, item);
                            continue;
                        }
                    }

                    return AdvancedSearchActionResponse.create({
                        results: Array.from(unique.values())
                    });
                }

                return AdvancedSearchActionResponse.create({ results: [] });
            }),

            this.actionListener.handleVSCodeRequest<RequestHighlightElementAction>(RequestHighlightElementAction.KIND, message => {
                const uri = message.action.semanticUri;
                this.actionDispatcher.dispatch(SelectAllAction.create(false));
                this.actionDispatcher.dispatch(SelectAction.create({ selectedElementsIDs: [uri] }));
                return HighlightElementActionResponse.create({ ok: true });
            })
        );
    }

    dispose(): void {
        this.toDispose.dispose();
    }
}
