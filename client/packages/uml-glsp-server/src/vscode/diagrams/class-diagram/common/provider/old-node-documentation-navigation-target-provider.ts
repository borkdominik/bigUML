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
import { type Args, type EditorContext, type NavigationTarget } from '@eclipse-glsp/protocol';
import { JsonOpenerOptions, type NavigationTargetProvider } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';
import { GClassNode } from '../../model/elements/class.graph-extension.js';

@injectable()
export class NodeDocumentationNavigationTargetProvider implements NavigationTargetProvider {
    targetTypeId = 'documentation';

    @inject(ClassDiagramModelState)
    protected readonly modelState: ClassDiagramModelState;

    getTargets(editorContext: EditorContext): NavigationTarget[] {
        if (editorContext.selectedElementIds.length === 1) {
            const taskNode = this.modelState.index.findByClass(editorContext.selectedElementIds[0], GClassNode);
            if (!taskNode || !(taskNode.id === 'task0')) {
                return [];
            }

            const sourceUri = this.modelState.sourceUri;
            if (!sourceUri) {
                return [];
            }

            const docUri = sourceUri.replace('.uml', '.md');
            const args: Args = {};
            args['jsonOpenerOptions'] = new JsonOpenerOptions({
                start: { line: 2, character: 3 },
                end: { line: 2, character: 7 }
            }).toJson();
            return [{ uri: docUri, args: args }];
        }
        return [];
    }
}
