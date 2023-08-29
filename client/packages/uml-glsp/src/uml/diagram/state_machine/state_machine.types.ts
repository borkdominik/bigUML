/**
 * Copyright (c) 2023 EclipseSource and others.
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
 **/
import { UmlDiagramType } from '@borkdominik-biguml/uml-common';
import { DefaultTypes } from '@eclipse-glsp/client';
import { QualifiedUtil } from '../../qualified.utils';

export namespace UmlStateMachineTypes {
    export const STATE_MACHINE = QualifiedUtil.representationTypeId(UmlDiagramType.STATE_MACHINE, DefaultTypes.NODE, 'StateMachine');
    export const REGION = QualifiedUtil.representationTypeId(UmlDiagramType.STATE_MACHINE, DefaultTypes.NODE, 'Region');
    export const INITIAL_STATE = QualifiedUtil.representationTypeId(UmlDiagramType.STATE_MACHINE, DefaultTypes.NODE_CIRCLE, 'InitialState');
    export const FINAL_STATE = QualifiedUtil.representationTypeId(UmlDiagramType.STATE_MACHINE, DefaultTypes.NODE, 'FinalState');
    export const STATE = QualifiedUtil.representationTypeId(UmlDiagramType.STATE_MACHINE, DefaultTypes.NODE, 'State');
    export const CHOICE = QualifiedUtil.representationTypeId(UmlDiagramType.STATE_MACHINE, DefaultTypes.NODE_DIAMOND, 'Choice');
    export const JOIN = QualifiedUtil.representationTypeId(UmlDiagramType.STATE_MACHINE, DefaultTypes.NODE_RECTANGLE, 'Join');
    export const FORK = QualifiedUtil.representationTypeId(UmlDiagramType.STATE_MACHINE, DefaultTypes.NODE_RECTANGLE, 'Fork');
    export const DEEP_HISTORY = QualifiedUtil.representationTypeId(UmlDiagramType.STATE_MACHINE, DefaultTypes.NODE_CIRCLE, 'DeepHistory');
    export const SHALLOW_HISTORY = QualifiedUtil.representationTypeId(UmlDiagramType.STATE_MACHINE, DefaultTypes.NODE_CIRCLE, 'ShallowHistory');


    export const TRANSITION = QualifiedUtil.representationTypeId(UmlDiagramType.STATE_MACHINE, DefaultTypes.EDGE, 'Transition');
}
