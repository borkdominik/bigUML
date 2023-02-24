/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
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
import { Action } from '@eclipse-glsp/client';
import { RequestAction, ResponseAction } from '@eclipse-glsp/protocol';

import { OutlineTreeNode } from './outline-tree-node';

export class SetOutlineAction implements ResponseAction {
    static readonly KIND = 'setOutlineAction';
    kind = SetOutlineAction.KIND;

    constructor(public responseId = '', public outlineTreeNodes: OutlineTreeNode[]) {}
}

export function isSetOutlineAction(action: Action): action is SetOutlineAction {
    return action.kind === SetOutlineAction.KIND;
}

export class RequestOutlineAction implements RequestAction<SetOutlineAction> {
    static readonly KIND = 'requestOutlineView';
    kind = RequestOutlineAction.KIND;

    constructor(public requestId: string = RequestAction.generateRequestId()) {}
}
