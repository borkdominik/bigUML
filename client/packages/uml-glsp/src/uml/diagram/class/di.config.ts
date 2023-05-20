/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { configureModelElement, GEdgeView, SCompartmentView, SLabelView, editFeature, selectFeature } from '@eclipse-glsp/client/lib';
import { ContainerModule } from 'inversify';

import { SEditableLabel } from '../../../graph';
import { InteractableCompartment } from '../../../graph/uml-compartment';
import { NamedElement, NamedElementView } from '../../elements';
import { UmlClassTypes } from './class.types';
import { UmlEdge } from './model';

export const umlClassDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    configureModelElement(context, UmlClassTypes.CLASS, NamedElement, NamedElementView);
    configureModelElement(context, UmlClassTypes.DATA_TYPE, NamedElement, NamedElementView);
    configureModelElement(context, UmlClassTypes.ENUMERATION, NamedElement, NamedElementView);
    configureModelElement(context, UmlClassTypes.ENUMERATION_LITERAL, InteractableCompartment, SCompartmentView);
    configureModelElement(context, UmlClassTypes.INTERFACE, NamedElement, NamedElementView);
    configureModelElement(context, UmlClassTypes.OPERATION, InteractableCompartment, SCompartmentView);
    configureModelElement(context, UmlClassTypes.PACKAGE, NamedElement, NamedElementView);
    configureModelElement(context, UmlClassTypes.PROPERTY, InteractableCompartment, SCompartmentView);
    configureModelElement(context, UmlClassTypes.PROPERTY_LABEL_TYPE, SEditableLabel, SLabelView);
    configureModelElement(context, UmlClassTypes.PROPERTY_LABEL_MULTIPLICITY, SEditableLabel, SLabelView);
    configureModelElement(context, UmlClassTypes.PRIMITIVE_TYPE, NamedElement, NamedElementView);

    configureModelElement(context, UmlClassTypes.ABSTRACTION, UmlEdge, GEdgeView, { disable: [editFeature, selectFeature] });
    configureModelElement(context, UmlClassTypes.ASSOCIATION, UmlEdge, GEdgeView, { disable: [editFeature, selectFeature] });
    configureModelElement(context, UmlClassTypes.ASSOCIATION_AGGREGATION, UmlEdge, GEdgeView, { disable: [editFeature, selectFeature] });
    configureModelElement(context, UmlClassTypes.ASSOCIATION_COMPOSITION, UmlEdge, GEdgeView, { disable: [editFeature, selectFeature] });
    configureModelElement(context, UmlClassTypes.DEPENDENCY, UmlEdge, GEdgeView, { disable: [editFeature, selectFeature] });
    configureModelElement(context, UmlClassTypes.INTERFACE_REALIZATION, UmlEdge, GEdgeView, { disable: [editFeature, selectFeature] });
    configureModelElement(context, UmlClassTypes.GENERALIZATION, UmlEdge, GEdgeView, { disable: [editFeature, selectFeature] });
    configureModelElement(context, UmlClassTypes.REALIZATION, UmlEdge, GEdgeView, { disable: [editFeature, selectFeature] });
    configureModelElement(context, UmlClassTypes.SUBSTITUTION, UmlEdge, GEdgeView, { disable: [editFeature, selectFeature] });
    configureModelElement(context, UmlClassTypes.USAGE, UmlEdge, GEdgeView, { disable: [editFeature, selectFeature] });
    configureModelElement(context, UmlClassTypes.PACKAGE_IMPORT, UmlEdge, GEdgeView, { disable: [editFeature, selectFeature] });
    configureModelElement(context, UmlClassTypes.PACKAGE_MERGE, UmlEdge, GEdgeView, { disable: [editFeature, selectFeature] });
});
