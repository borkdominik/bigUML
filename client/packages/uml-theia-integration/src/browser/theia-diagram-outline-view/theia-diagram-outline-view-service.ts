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
import {
    DiagramOutlineViewService
} from "@eclipsesource/uml-sprotty/lib/features/diagram-outline-view/diagram-outline-view-service";
import { OutlineTreeNode } from "@eclipsesource/uml-sprotty/lib/features/diagram-outline-view/outline-tree-node";
import { inject, injectable, postConstruct } from "@theia/core/shared/inversify";
import { OutlineSymbolInformationNode } from "@theia/outline-view/lib/browser/outline-view-widget";
import { DiagramOutlineViewWidgetService } from "../diagram-outline-view-widget/diagram-outline-view-widget-service";

export interface DiagramOutlineSymbolInformationNode extends OutlineSymbolInformationNode {
    children: DiagramOutlineSymbolInformationNode[]
}

export type TheiaDiagramOutlineFactory = () => TheiaDiagramOutlineService;
export const TheiaDiagramOutlineFactory = Symbol("TheiaDiagramOutlineFactory");

@injectable()
export class TheiaDiagramOutlineService extends DiagramOutlineViewService {

    @inject(DiagramOutlineViewWidgetService)
    protected readonly outlineViewService: DiagramOutlineViewWidgetService;

    @postConstruct()
    protected initialize(): void {
        this.outlineViewService.onDidSelect(e => {
            this.navigateToElementId(e.id);
        });
    }

    updateOutline(nodes: OutlineTreeNode[]): void {
        const mappedNodes = nodes.map(node => mapOutlineTreeNodeToOutlineSymbolInformation(node));
        this.outlineViewService.publish(mappedNodes);
    }

}

function mapOutlineTreeNodeToOutlineSymbolInformation(outlineTreeNode: OutlineTreeNode): DiagramOutlineSymbolInformationNode {

    if (outlineTreeNode.children.length === 0) {
        return {
            id: outlineTreeNode.semanticUri,
            children: [], parent: undefined,
            iconClass: outlineTreeNode.iconClass,
            expanded: true,
            selected: false,
            name: outlineTreeNode.label };
    }
    const children = outlineTreeNode.children.map(c => mapOutlineTreeNodeToOutlineSymbolInformation(c));

    return {
        id: outlineTreeNode.semanticUri,
        children,
        parent: undefined,
        iconClass: outlineTreeNode.iconClass,
        expanded: true,
        selected: false,
        name: outlineTreeNode.label };
}

