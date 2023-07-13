/********************************************************************************
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
 ********************************************************************************/
import { configureModelElement, PolylineEdgeView, SCompartmentView, SEdge, SLabelView } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';
import { SEditableLabel } from '../../../graph';
import { NamedElement } from '../../elements/named-element.model';
import { NamedElementView } from '../../elements/named-element.view';
import { UmlUseCaseTypes } from './usecase.types';
import { ActorNodeView, StickFigureNode } from './views/actor-node-view';
import { ActorNode, ActorView } from './views/actor-view';
import { UseCaseNodeView } from './views/use-case-node-view';

export const umlUseCaseDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    configureModelElement(context, UmlUseCaseTypes.USE_CASE, NamedElement, UseCaseNodeView);

    configureModelElement(context, UmlUseCaseTypes.SUBJECT, NamedElement, NamedElementView);

    configureModelElement(context, UmlUseCaseTypes.ACTOR, ActorNode, ActorView);
    configureModelElement(context, UmlUseCaseTypes.STICKFIGURE_NODE, StickFigureNode, ActorNodeView);

    configureModelElement(context, UmlUseCaseTypes.PROPERTY, SEditableLabel, SCompartmentView);
    configureModelElement(context, UmlUseCaseTypes.PROPERTY_LABEL_TYPE, SEditableLabel, SLabelView);
    configureModelElement(context, UmlUseCaseTypes.PROPERTY_LABEL_MULTIPLICITY, SEditableLabel, SLabelView);

    configureModelElement(context, UmlUseCaseTypes.INCLUDE, SEdge, PolylineEdgeView);

    configureModelElement(context, UmlUseCaseTypes.EXTEND, SEdge, PolylineEdgeView);

    configureModelElement(context, UmlUseCaseTypes.ASSOCIATION, SEdge, PolylineEdgeView);

    configureModelElement(context, UmlUseCaseTypes.GENERALIZATION, SEdge, PolylineEdgeView);
});
