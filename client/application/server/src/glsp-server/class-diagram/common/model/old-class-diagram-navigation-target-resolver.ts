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
import { NavigationTarget } from '@eclipse-glsp/protocol';
import { NavigationTargetResolution, NavigationTargetResolver } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';
import { GClassNode } from '../../model/elements/class.graph-extension.js';

@injectable()
export class ClassDiagramNavigationTargetResolver extends NavigationTargetResolver {
    @inject(ClassDiagramModelState)
    protected readonly modelState: ClassDiagramModelState;

    async resolve(navigationTarget: NavigationTarget): Promise<NavigationTargetResolution> {
        if (navigationTarget.args && navigationTarget.args['name']) {
            const name = navigationTarget.args['name'];
            const taskNodes = this.modelState.index.getAllByClass<GClassNode>(GClassNode);
            const element = taskNodes.find(node => name === node.name);
            if (element) {
                return new NavigationTargetResolution([element.id]);
            }
            return new NavigationTargetResolution([], this.createArgsWithWarning(`Couldn't find element with name ${name}`));
        }
        return NavigationTargetResolution.EMPTY;
    }
}
