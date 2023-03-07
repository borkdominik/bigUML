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
import { configureModelElement, PolylineEdgeView, SCompartmentView, SEdge, SLabelView } from '@eclipse-glsp/client/lib';
import { ContainerModule } from 'inversify';

import { IconLabelCompartment, SEditableLabel } from '../../../graph';
import { NamedElement, NamedElementView } from '../../elements';
import { UmlTypes } from '../../uml.types';
import { UmlClassTypes } from './class.types';

export const umlClassDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    // Class
    configureModelElement(context, UmlClassTypes.CLASS, NamedElement, NamedElementView);
    configureModelElement(context, UmlClassTypes.ABSTRACT_CLASS, NamedElement, NamedElementView);

    // Enumeration
    configureModelElement(context, UmlClassTypes.ENUMERATION, NamedElement, NamedElementView);

    // Enumeration Literal
    configureModelElement(context, UmlClassTypes.ENUMERATION_LITERAL, IconLabelCompartment, SCompartmentView);

    // Interface
    configureModelElement(context, UmlClassTypes.INTERFACE, NamedElement, NamedElementView);

    // Association
    configureModelElement(context, UmlClassTypes.ASSOCIATION, SEdge, PolylineEdgeView);
    configureModelElement(context, UmlClassTypes.AGGREGATION, SEdge, PolylineEdgeView);
    configureModelElement(context, UmlClassTypes.COMPOSITION, SEdge, PolylineEdgeView);

    // Generalization
    configureModelElement(context, UmlClassTypes.CLASS_GENERALIZATION, SEdge, PolylineEdgeView);

    // Operation
    configureModelElement(context, UmlClassTypes.OPERATION, IconLabelCompartment, SCompartmentView);

    // Property
    configureModelElement(context, UmlClassTypes.PROPERTY, IconLabelCompartment, SCompartmentView);
    configureModelElement(context, UmlClassTypes.LABEL_PROPERTY_TYPE, SEditableLabel, SLabelView);
    configureModelElement(context, UmlClassTypes.LABEL_PROPERTY_MULTIPLICITY, SEditableLabel, SLabelView);

    // Data Type
    configureModelElement(context, UmlClassTypes.DATA_TYPE, NamedElement, NamedElementView);

    // Data Type
    configureModelElement(context, UmlClassTypes.PRIMITIVE_TYPE, NamedElement, NamedElementView);

    // PACKAGE
    configureModelElement(context, UmlClassTypes.PACKAGE, NamedElement, NamedElementView);

    // Abstraction
    configureModelElement(context, UmlClassTypes.ABSTRACTION, SEdge, PolylineEdgeView);

    // Abstraction
    configureModelElement(context, UmlClassTypes.DEPENDENCY, SEdge, PolylineEdgeView);

    // Interface Realization
    configureModelElement(context, UmlClassTypes.INTERFACE_REALIZATION, SEdge, PolylineEdgeView);

    // Realization
    configureModelElement(context, UmlClassTypes.REALIZATION, SEdge, PolylineEdgeView);

    // Substitution
    configureModelElement(context, UmlClassTypes.SUBSTITUTION, SEdge, PolylineEdgeView);

    // Usage
    configureModelElement(context, UmlClassTypes.USAGE, SEdge, PolylineEdgeView);

    // Package Import
    configureModelElement(context, UmlClassTypes.PACKAGE_IMPORT, SEdge, PolylineEdgeView);

    // Package Merge
    configureModelElement(context, UmlClassTypes.PACKAGE_MERGE, SEdge, PolylineEdgeView);

    // Other
    configureModelElement(context, UmlTypes.LABEL_EDGE_MULTIPLICITY, SEditableLabel, SLabelView);
});
