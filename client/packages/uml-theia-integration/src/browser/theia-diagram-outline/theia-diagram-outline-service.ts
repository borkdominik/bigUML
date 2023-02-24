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
import { DiagramOutlineService, OutlineTreeNode } from '@eclipsesource/uml-sprotty/lib/features/diagram-outline';
import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';

import { DiagramOutlineViewService } from '../diagram-outline-view/diagram-outline-view-service';
import { DiagramOutlineSymbolInformationNode } from '../diagram-outline-view/diagram-outline-view-widget';
import { belongsToDiagramWidget, UmlDiagramManager } from '../diagram/uml-diagram-manager';

export type TheiaDiagramOutlineFactory = () => TheiaDiagramOutlineService;
export const TheiaDiagramOutlineFactory = Symbol('TheiaDiagramOutlineFactory');

@injectable()
export class TheiaDiagramOutlineService extends DiagramOutlineService {
    @inject(DiagramOutlineViewService)
    protected readonly diagramOutlineViewService: DiagramOutlineViewService;

    @inject(UmlDiagramManager)
    protected readonly diagramManager: UmlDiagramManager;

    protected readonly mappings = new Map<string, [OutlineTreeNode, DiagramOutlineSymbolInformationNode]>();

    @postConstruct()
    init(): void {
        this.diagramOutlineViewService.onDidSelect(async node => {
            if (DiagramOutlineSymbolInformationNode.is(node)) {
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
            this.diagramOutlineViewService.publish(mappedNodes);
        }
    }

    async onSelect(informationNode: DiagramOutlineSymbolInformationNode): Promise<void> {
        const mapping = this.mappings.get(informationNode.id);

        if (mapping !== undefined) {
            await this.center(mapping[0]);
        }
    }

    protected cachedMap(outlineTreeNode: OutlineTreeNode): DiagramOutlineSymbolInformationNode {
        let informationNode: DiagramOutlineSymbolInformationNode;

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
