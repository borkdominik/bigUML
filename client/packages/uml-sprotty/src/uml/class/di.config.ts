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
import '@eclipse-glsp/client/css/glsp-sprotty.css';
import 'sprotty/css/edit-label.css';

import { configureModelElement, PolylineEdgeView, SCompartmentView, SEdge, SLabelView } from '@eclipse-glsp/client/lib';
import { ContainerModule } from 'inversify';

import { IconLabelCompartment, SEditableLabel } from '../../model';
import { UmlTypes } from '../../utils';
import { NamedElement } from '../shared/named-element.model';
import { NamedElementView } from '../shared/named-element.view';

export default function createClassModule(): ContainerModule {
    const classModule = new ContainerModule((bind, unbind, isBound, rebind) => {
        const context = { bind, unbind, isBound, rebind };

        // Class
        configureModelElement(context, UmlTypes.CLASS, NamedElement, NamedElementView);
        configureModelElement(context, UmlTypes.ABSTRACT_CLASS, NamedElement, NamedElementView);

        // Enumeration
        configureModelElement(context, UmlTypes.ENUMERATION, NamedElement, NamedElementView);

        // Enumeration Literal
        configureModelElement(context, UmlTypes.ENUMERATION_LITERAL, IconLabelCompartment, SCompartmentView);

        // Interface
        configureModelElement(context, UmlTypes.INTERFACE, NamedElement, NamedElementView);

        // Association
        configureModelElement(context, UmlTypes.ASSOCIATION, SEdge, PolylineEdgeView);
        configureModelElement(context, UmlTypes.AGGREGATION, SEdge, PolylineEdgeView);
        configureModelElement(context, UmlTypes.COMPOSITION, SEdge, PolylineEdgeView);

        // Generalization
        configureModelElement(context, UmlTypes.CLASS_GENERALIZATION, SEdge, PolylineEdgeView);

        // Operation
        configureModelElement(context, UmlTypes.OPERATION, IconLabelCompartment, SCompartmentView);

        // Property
        configureModelElement(context, UmlTypes.PROPERTY, IconLabelCompartment, SCompartmentView);
        configureModelElement(context, UmlTypes.LABEL_PROPERTY_TYPE, SEditableLabel, SLabelView);
        configureModelElement(context, UmlTypes.LABEL_PROPERTY_MULTIPLICITY, SEditableLabel, SLabelView);

        // Data Type
        configureModelElement(context, UmlTypes.DATA_TYPE, NamedElement, NamedElementView);

        // Data Type
        configureModelElement(context, UmlTypes.PRIMITIVE_TYPE, NamedElement, NamedElementView);

        // PACKAGE
        configureModelElement(context, UmlTypes.PACKAGE, NamedElement, NamedElementView);

        // Abstraction
        configureModelElement(context, UmlTypes.ABSTRACTION, SEdge, PolylineEdgeView);

        // Abstraction
        configureModelElement(context, UmlTypes.DEPENDENCY, SEdge, PolylineEdgeView);

        // Interface Realization
        configureModelElement(context, UmlTypes.INTERFACE_REALIZATION, SEdge, PolylineEdgeView);

        // Realization
        configureModelElement(context, UmlTypes.REALIZATION, SEdge, PolylineEdgeView);

        // Substitution
        configureModelElement(context, UmlTypes.SUBSTITUTION, SEdge, PolylineEdgeView);

        // Usage
        configureModelElement(context, UmlTypes.USAGE, SEdge, PolylineEdgeView);

        // Package Import
        configureModelElement(context, UmlTypes.PACKAGE_IMPORT, SEdge, PolylineEdgeView);

        // Package Merge
        configureModelElement(context, UmlTypes.PACKAGE_MERGE, SEdge, PolylineEdgeView);

        // Other
        configureModelElement(context, UmlTypes.LABEL_EDGE_MULTIPLICITY, SEditableLabel, SLabelView);
    });

    return classModule;
}
