/********************************************************************************
 * Copyright (c) 2022-2023 STMicroelectronics and others.
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
import { Args, EditorContext, NavigationTarget } from '@eclipse-glsp/protocol';
import { GEdge, NavigationTargetProvider } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { GPackageClassNode } from '../../model/elements/class.graph-extension.js';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';

@injectable()
export abstract class AbstractNextOrPreviousNavigationTargetProvider implements NavigationTargetProvider {
    abstract targetTypeId: string;

    @inject(PackageDiagramModelState)
    protected readonly modelState: PackageDiagramModelState;

    getTargets(editorContext: EditorContext): NavigationTarget[] {
        const sourceUri = this.modelState.sourceUri;
        const edges: GEdge[] = [];
        editorContext.selectedElementIds
            .map(id => this.modelState.index.get(id))
            .filter(e => e instanceof GPackageClassNode)
            .map(e => e as GPackageClassNode)
            .map(taskNode => edges.push(...this.getEdges(taskNode)));
        return edges.map(edge => this.getSourceOrTarget(edge)).map(id => this.createNavigationTarget(sourceUri, id));
    }

    protected createNavigationTarget(sourceURI: string | undefined, id: string): NavigationTarget {
        return { uri: sourceURI ?? '', args: this.createElementIdMap(id) };
    }

    protected createElementIdMap(id: string): Args {
        const map: Args = {};
        map[NavigationTarget.ELEMENT_IDS] = id;
        return map;
    }

    protected abstract getEdges(taskNode: GPackageClassNode): GEdge[];

    protected abstract getSourceOrTarget(edge: GEdge): string;
}
