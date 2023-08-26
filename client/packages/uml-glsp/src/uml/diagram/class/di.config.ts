/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { UmlDiagramType } from '@borkdominik-biguml/uml-common';
import { configureModelElement, GEdgeView, SCompartmentView, SEdge } from '@eclipse-glsp/client/lib';
import { ContainerModule } from 'inversify';

import { InteractableCompartment } from '../../../graph/uml-compartment';
import { NamedElement, NamedElementView } from '../../elements';
import { registerAssociationElement } from '../../elements/association/association-element';
import { registerPropertyElement } from '../../elements/property/property-element';
import { UmlClassTypes } from './class.types';

export const umlClassDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    configureModelElement(context, UmlClassTypes.CLASS, NamedElement, NamedElementView);
    configureModelElement(context, UmlClassTypes.DATA_TYPE, NamedElement, NamedElementView);
    configureModelElement(context, UmlClassTypes.ENUMERATION, NamedElement, NamedElementView);
    configureModelElement(context, UmlClassTypes.ENUMERATION_LITERAL, InteractableCompartment, SCompartmentView);
    configureModelElement(context, UmlClassTypes.INTERFACE, NamedElement, NamedElementView);
    configureModelElement(context, UmlClassTypes.OPERATION, InteractableCompartment, SCompartmentView);
    configureModelElement(context, UmlClassTypes.PACKAGE, NamedElement, NamedElementView);
    registerPropertyElement(context, UmlDiagramType.CLASS);
    configureModelElement(context, UmlClassTypes.PRIMITIVE_TYPE, NamedElement, NamedElementView);

    configureModelElement(context, UmlClassTypes.ABSTRACTION, SEdge, GEdgeView);
    registerAssociationElement(context, UmlDiagramType.CLASS);
    configureModelElement(context, UmlClassTypes.DEPENDENCY, SEdge, GEdgeView);
    configureModelElement(context, UmlClassTypes.INTERFACE_REALIZATION, SEdge, GEdgeView);
    configureModelElement(context, UmlClassTypes.GENERALIZATION, SEdge, GEdgeView);
    configureModelElement(context, UmlClassTypes.REALIZATION, SEdge, GEdgeView);
    configureModelElement(context, UmlClassTypes.SUBSTITUTION, SEdge, GEdgeView);
    configureModelElement(context, UmlClassTypes.USAGE, SEdge, GEdgeView);
    configureModelElement(context, UmlClassTypes.PACKAGE_IMPORT, SEdge, GEdgeView);
    configureModelElement(context, UmlClassTypes.PACKAGE_MERGE, SEdge, GEdgeView);
});
