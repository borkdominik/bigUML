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
import {configureModelElement, PolylineEdgeView, SCompartmentView, SEdge, SLabelView} from '@eclipse-glsp/client';
import {ContainerModule} from 'inversify';
import {NamedElement, NamedElementView} from '../../elements';
import {UmlDeploymentTypes} from './deployment.types';
import {IconLabelCompartment, SEditableLabel} from "../../../graph";

export const umlDeploymentDiagramModule = new ContainerModule(
    (bind, unbind, isBound, rebind) => {
        const context = {bind, unbind, isBound, rebind};

        // NamedElements
        configureModelElement(context, UmlDeploymentTypes.DEPLOYMENT_SPECIFICATION, NamedElement, NamedElementView);
        configureModelElement(context, UmlDeploymentTypes.ARTIFACT, NamedElement, NamedElementView);
        configureModelElement(context, UmlDeploymentTypes.DEVICE, NamedElement, NamedElementView);
        configureModelElement(context, UmlDeploymentTypes.EXECUTION_ENVIRONMENT, NamedElement, NamedElementView);
        configureModelElement(context, UmlDeploymentTypes.MODEL, NamedElement, NamedElementView);
        configureModelElement(context, UmlDeploymentTypes.NODE, NamedElement, NamedElementView);
        configureModelElement(context, UmlDeploymentTypes.PACKAGE, NamedElement, NamedElementView);

        // Features
        // IconLabelCompartment
        configureModelElement(context, UmlDeploymentTypes.OPERATION, IconLabelCompartment, SCompartmentView);
        configureModelElement(context, UmlDeploymentTypes.PROPERTY, IconLabelCompartment, SCompartmentView);
        // SEditableLabel
        configureModelElement(context, UmlDeploymentTypes.PROPERTY_LABEL_TYPE, SEditableLabel, SLabelView);
        configureModelElement(context, UmlDeploymentTypes.PROPERTY_LABEL_MULTIPLICITY, SEditableLabel, SLabelView);

        // SEdges
        configureModelElement(context, UmlDeploymentTypes.COMMUNICATION_PATH, SEdge, PolylineEdgeView);
        configureModelElement(context, UmlDeploymentTypes.DEPENDENCY, SEdge, PolylineEdgeView);
        configureModelElement(context, UmlDeploymentTypes.MANIFESTATION, SEdge, PolylineEdgeView);
        configureModelElement(context, UmlDeploymentTypes.DEPLOYMENT, SEdge, PolylineEdgeView);
        configureModelElement(context, UmlDeploymentTypes.GENERALIZATION, SEdge, PolylineEdgeView);
    }
);
