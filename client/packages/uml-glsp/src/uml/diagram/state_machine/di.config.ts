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
import { configureModelElement, PolylineEdgeView, SEdge } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';
import { NamedElement, NamedElementView } from '../../elements';
import { UmlStateMachineTypes } from './state_machine.types';
import { ChoiceNodeView } from './views/choice_node_view';
import { DeepHistoryNodeView } from './views/deep_history_node_view';
import { FinalNodeView } from './views/final_node_view';
import { ForkJoinNodeView } from './views/fork_join_node_view';
import { InitialNodeView } from './views/initial_node_view';
import { ShallowHistoryNodeView } from './views/shallow_history_node_view';

export const umlStateMachineDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    configureModelElement(context, UmlStateMachineTypes.STATE_MACHINE, NamedElement, NamedElementView);
    configureModelElement(context, UmlStateMachineTypes.REGION, NamedElement, NamedElementView);
    configureModelElement(context, UmlStateMachineTypes.INITIAL_STATE, NamedElement, InitialNodeView);
    configureModelElement(context, UmlStateMachineTypes.FINAL_STATE, NamedElement, FinalNodeView);
    configureModelElement(context, UmlStateMachineTypes.STATE, NamedElement, NamedElementView);
    configureModelElement(context, UmlStateMachineTypes.CHOICE, NamedElement, ChoiceNodeView);
    configureModelElement(context, UmlStateMachineTypes.JOIN, NamedElement, ForkJoinNodeView);
    configureModelElement(context, UmlStateMachineTypes.FORK, NamedElement, ForkJoinNodeView);
    configureModelElement(context, UmlStateMachineTypes.DEEP_HISTORY, NamedElement, DeepHistoryNodeView);
    configureModelElement(context, UmlStateMachineTypes.SHALLOW_HISTORY, NamedElement, ShallowHistoryNodeView);

    configureModelElement(context, UmlStateMachineTypes.TRANSITION, SEdge, PolylineEdgeView);
});
