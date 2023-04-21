/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import { PolylineEdgeView, SCompartmentView, SLabelView, configureModelElement, editFeature, selectFeature } from '@eclipse-glsp/client';
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

    // edit is disabled only if select is disabled too, however in sprotty 0.11 it wasn't so.
    // is it expected behavior?
    const disabledEdgeFeatures = [editFeature, selectFeature];
    configureModelElement(context, UmlClassTypes.ABSTRACTION, UmlEdge, PolylineEdgeView, { disable: disabledEdgeFeatures });
    configureModelElement(context, UmlClassTypes.ASSOCIATION, UmlEdge, PolylineEdgeView, { disable: disabledEdgeFeatures });
    configureModelElement(context, UmlClassTypes.ASSOCIATION_AGGREGATION, UmlEdge, PolylineEdgeView, { disable: disabledEdgeFeatures });
    configureModelElement(context, UmlClassTypes.ASSOCIATION_COMPOSITION, UmlEdge, PolylineEdgeView, { disable: disabledEdgeFeatures });
    configureModelElement(context, UmlClassTypes.DEPENDENCY, UmlEdge, PolylineEdgeView, { disable: disabledEdgeFeatures });
    configureModelElement(context, UmlClassTypes.INTERFACE_REALIZATION, UmlEdge, PolylineEdgeView, { disable: disabledEdgeFeatures });
    configureModelElement(context, UmlClassTypes.GENERALIZATION, UmlEdge, PolylineEdgeView, { disable: disabledEdgeFeatures });
    configureModelElement(context, UmlClassTypes.REALIZATION, UmlEdge, PolylineEdgeView, { disable: disabledEdgeFeatures });
    configureModelElement(context, UmlClassTypes.SUBSTITUTION, UmlEdge, PolylineEdgeView, { disable: disabledEdgeFeatures });
    configureModelElement(context, UmlClassTypes.USAGE, UmlEdge, PolylineEdgeView, { disable: disabledEdgeFeatures });
    configureModelElement(context, UmlClassTypes.PACKAGE_IMPORT, UmlEdge, PolylineEdgeView, { disable: disabledEdgeFeatures });
    configureModelElement(context, UmlClassTypes.PACKAGE_MERGE, UmlEdge, PolylineEdgeView, { disable: disabledEdgeFeatures });
});
