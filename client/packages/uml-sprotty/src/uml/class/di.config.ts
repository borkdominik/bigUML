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
import "@eclipse-glsp/client/css/glsp-sprotty.css";
import "sprotty/css/edit-label.css";

import { configureModelElement, PolylineEdgeView, SCompartmentView, SEdge, SLabelView } from "@eclipse-glsp/client/lib";
import { ContainerModule } from "inversify";

import { IconLabelCompartment, LabeledNode, SEditableLabel } from "../../model";
import { UmlTypes } from "../../utils";
import { IconView } from "../../views/commons";
import { AggregationEdgeView } from "./elements/association";
import { ClassNodeView } from "./elements/class";
import { EnumerationNodeView } from "./elements/enumeration";
import { IconClass, IconProperty } from "./model";

export default function createClassModule(): ContainerModule {
    const classModule = new ContainerModule((bind, unbind, isBound, rebind) => {
        const context = { bind, unbind, isBound, rebind };
        // CLASS DIAGRAM
        configureModelElement(
            context,
            UmlTypes.ICON_CLASS,
            IconClass,
            IconView
        );
        configureModelElement(
            context,
            UmlTypes.CLASS,
            LabeledNode,
            ClassNodeView
        );
        configureModelElement(
            context,
            UmlTypes.ABSTRACT_CLASS,
            LabeledNode,
            ClassNodeView
        );
        configureModelElement(
            context,
            UmlTypes.ICON_ENUMERATION,
            IconClass,
            IconView
        );
        configureModelElement(
            context,
            UmlTypes.ENUMERATION,
            LabeledNode,
            EnumerationNodeView
        );
        configureModelElement(
            context,
            UmlTypes.INTERFACE,
            LabeledNode,
            ClassNodeView
        );
        configureModelElement(
            context,
            UmlTypes.ASSOCIATION,
            SEdge,
            PolylineEdgeView
        );
        configureModelElement(
            context,
            UmlTypes.AGGREGATION,
            SEdge,
            AggregationEdgeView
        );
        configureModelElement(
            context,
            UmlTypes.COMPOSITION,
            SEdge,
            AggregationEdgeView
        );
        configureModelElement(
            context,
            UmlTypes.CLASS_GENERALIZATION,
            SEdge,
            PolylineEdgeView
        );
        // configureModelElement(context, UmlTypes.PROPERTY, SLabelNodeProperty, LabelNodeView);
        configureModelElement(
            context,
            UmlTypes.PROPERTY,
            IconLabelCompartment,
            SCompartmentView
        );
        configureModelElement(
            context,
            UmlTypes.ICON_PROPERTY,
            IconProperty,
            IconView
        );
        configureModelElement(
            context,
            UmlTypes.LABEL_PROPERTY_NAME,
            SEditableLabel,
            SLabelView
        );
        configureModelElement(
            context,
            UmlTypes.LABEL_PROPERTY_TYPE,
            SEditableLabel,
            SLabelView
        );
        configureModelElement(
            context,
            UmlTypes.LABEL_PROPERTY_MULTIPLICITY,
            SEditableLabel,
            SLabelView
        );
        configureModelElement(
            context,
            UmlTypes.LABEL_EDGE_MULTIPLICITY,
            SEditableLabel,
            SLabelView
        );
    });

    return classModule;
}
