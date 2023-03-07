/********************************************************************************
 * Copyright (c) 2020-2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { OutlineService, OutlineTreeNode } from '@eclipsesource/uml-glsp/lib/features/outline';
import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';

import { belongsToDiagramWidget, UTDiagramManager } from '../../../glsp/diagram/ut-diagram.manager';
import { OutlineWidgetService } from '../widget/outline-widget.service';
import { OutlineWidgetSymbolInformationNode } from '../widget/outline-widget.widget';

export type OutlineIntegrationFactory = () => OutlineIntegrationService;
export const OutlineIntegrationFactory = Symbol('OutlineIntegrationFactory');

@injectable()
export class OutlineIntegrationService extends OutlineService {
    @inject(OutlineWidgetService)
    protected readonly outlineWidgetService: OutlineWidgetService;

    @inject(UTDiagramManager)
    protected readonly diagramManager: UTDiagramManager;

    protected readonly mappings = new Map<string, [OutlineTreeNode, OutlineWidgetSymbolInformationNode]>();

    @postConstruct()
    init(): void {
        this.outlineWidgetService.onDidSelect(async node => {
            if (OutlineWidgetSymbolInformationNode.is(node)) {
                await this.onSelect(node);
            }
        });
    }

    updateOutline(outlineNodes: OutlineTreeNode[]): void {
        this.mappings.clear();

        const mappedNodes = outlineNodes.map(outlineNode => this.cachedMap(outlineNode));

        if (
            this.diagramServerProxy !== undefined &&
            belongsToDiagramWidget(this.diagramManager.currentEditor, this.diagramServerProxy.clientId)
        ) {
            this.outlineWidgetService.publish(mappedNodes);
        }
    }

    async onSelect(informationNode: OutlineWidgetSymbolInformationNode): Promise<void> {
        const mapping = this.mappings.get(informationNode.id);

        if (mapping !== undefined) {
            await this.center(mapping[0]);
        }
    }

    protected cachedMap(outlineTreeNode: OutlineTreeNode): OutlineWidgetSymbolInformationNode {
        let informationNode: OutlineWidgetSymbolInformationNode;

        if (outlineTreeNode.children.length === 0) {
            informationNode = {
                id: outlineTreeNode.semanticUri,
                children: [],
                parent: undefined,
                iconClass: outlineTreeNode.iconClass,
                expanded: true,
                selected: false,
                name: outlineTreeNode.label
            };
        } else {
            const children = outlineTreeNode.children.map(c => this.cachedMap(c));

            informationNode = {
                id: outlineTreeNode.semanticUri,
                children,
                parent: undefined,
                iconClass: outlineTreeNode.iconClass,
                expanded: true,
                selected: false,
                name: outlineTreeNode.label
            };
        }

        this.mappings.set(informationNode.id, [outlineTreeNode, informationNode]);
        return informationNode;
    }
}
