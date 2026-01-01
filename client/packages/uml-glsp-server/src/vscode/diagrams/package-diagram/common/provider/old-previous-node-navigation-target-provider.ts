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
import { type GEdge } from '@eclipse-glsp/graph';
import { injectable } from 'inversify';
import { type GPackageClassNode } from '../../model/elements/class.graph-extension.js';
import { AbstractNextOrPreviousNavigationTargetProvider } from './old-abstract-next-or-previous-navigation-target-provider.js';

@injectable()
export class PreviousNodeNavigationTargetProvider extends AbstractNextOrPreviousNavigationTargetProvider {
    targetTypeId = 'previous';
    protected getEdges(taskNode: GPackageClassNode): GEdge[] {
        return this.modelState.index.getIncomingEdges(taskNode);
    }

    protected getSourceOrTarget(edge: GEdge): string {
        return edge.sourceId;
    }
}
