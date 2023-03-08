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
import { UmlClassTypes } from './class.types';

export const umlClassDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    configureModelElement(context, UmlClassTypes.CLASS, NamedElement, NamedElementView);
    configureModelElement(context, UmlClassTypes.DATA_TYPE, NamedElement, NamedElementView);
    configureModelElement(context, UmlClassTypes.ENUMERATION, NamedElement, NamedElementView);
    configureModelElement(context, UmlClassTypes.ENUMERATION_LITERAL, IconLabelCompartment, SCompartmentView);
    configureModelElement(context, UmlClassTypes.INTERFACE, NamedElement, NamedElementView);
    configureModelElement(context, UmlClassTypes.OPERATION, IconLabelCompartment, SCompartmentView);
    configureModelElement(context, UmlClassTypes.PACKAGE, NamedElement, NamedElementView);
    configureModelElement(context, UmlClassTypes.PROPERTY, IconLabelCompartment, SCompartmentView);
    configureModelElement(context, UmlClassTypes.PROPERTY_LABEL_TYPE, SEditableLabel, SLabelView);
    configureModelElement(context, UmlClassTypes.PROPERTY_LABEL_MULTIPLICITY, SEditableLabel, SLabelView);
    configureModelElement(context, UmlClassTypes.PRIMITIVE_TYPE, NamedElement, NamedElementView);

    configureModelElement(context, UmlClassTypes.ABSTRACTION, SEdge, PolylineEdgeView);
    configureModelElement(context, UmlClassTypes.ASSOCIATION, SEdge, PolylineEdgeView);
    configureModelElement(context, UmlClassTypes.DEPENDENCY, SEdge, PolylineEdgeView);
    configureModelElement(context, UmlClassTypes.INTERFACE_REALIZATION, SEdge, PolylineEdgeView);
    configureModelElement(context, UmlClassTypes.GENERALIZATION, SEdge, PolylineEdgeView);
    configureModelElement(context, UmlClassTypes.REALIZATION, SEdge, PolylineEdgeView);
    configureModelElement(context, UmlClassTypes.SUBSTITUTION, SEdge, PolylineEdgeView);
    configureModelElement(context, UmlClassTypes.USAGE, SEdge, PolylineEdgeView);
    configureModelElement(context, UmlClassTypes.PACKAGE_IMPORT, SEdge, PolylineEdgeView);
    configureModelElement(context, UmlClassTypes.PACKAGE_MERGE, SEdge, PolylineEdgeView);
});
