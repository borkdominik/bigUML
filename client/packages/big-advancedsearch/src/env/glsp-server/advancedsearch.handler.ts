/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { UmlDiagramModelState } from '@borkdominik-biguml/uml-glsp-server/vscode';
import { SelectAction, SelectAllAction } from '@eclipse-glsp/protocol';
import { ModelState, type ActionHandler, type MaybePromise } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { AdvancedSearchActionResponse, RequestAdvancedSearchAction } from '../common/advancedsearch.action.js';
import { HighlightElementActionResponse, RequestHighlightElementAction } from '../common/highlight.action.js';
import type { SearchResult } from '../common/searchresult.js';
import type { IMatcher } from './matchers/IMatcher.js';
import { ActivityDiagramMatcher } from './matchers/activitymatcher.js';
import { ClassDiagramMatcher } from './matchers/classmatcher.js';
import { CommunicationDiagramMatcher } from './matchers/communicationmatcher.js';
import { InformationFlowDiagramMatcher } from './matchers/informationflowmatcher.js';
import { PackageDiagramMatcher } from './matchers/packagematcher.js';
import { StateMachineDiagramMatcher } from './matchers/statemachinematcher.js';
import { UseCaseDiagramMatcher } from './matchers/usecasematcher.js';

@injectable()
export class AdvancedSearchActionHandler implements ActionHandler {
    actionKinds = [RequestAdvancedSearchAction.KIND, RequestHighlightElementAction.KIND];

    @inject(ModelState)
    readonly modelState: UmlDiagramModelState;

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

    execute(action: RequestAdvancedSearchAction | RequestHighlightElementAction): MaybePromise<any[]> {
        if (RequestAdvancedSearchAction.is(action)) {
            return this.handleSearch(action);
        }
        if (RequestHighlightElementAction.is(action)) {
            return this.handleHighlight(action);
        }
        return [];
    }

    protected handleSearch(action: RequestAdvancedSearchAction): any[] {
        const text = this.modelState.semanticSerializer.serialize(this.modelState.semanticRoot);
        const sourceModel = JSON.parse(text);
        const modelAdapter = { getSourceModel: () => sourceModel };
        const results: SearchResult[] = [];
        const rawQuery = action.query.trim();

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
            results.push(...matcher.match(modelAdapter));
        }

        const filtered = results.filter(item => {
            const itemType = item.type.toLowerCase();
            const name = item.name?.toLowerCase() ?? '';
            const details = item.details?.toLowerCase() ?? '';
            const parentName = item.parentName?.toLowerCase() ?? '';
            const matchesType = !type || itemType.includes(type);
            const matchesPattern = !pattern || name.includes(pattern) || details.includes(pattern) || parentName.includes(pattern);
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

        return [AdvancedSearchActionResponse.create({ results: Array.from(unique.values()) })];
    }

    protected handleHighlight(action: RequestHighlightElementAction): any[] {
        const uri = action.semanticUri;
        return [
            SelectAllAction.create(false),
            SelectAction.create({ selectedElementsIDs: [uri] }),
            HighlightElementActionResponse.create({ ok: true })
        ];
    }
}
