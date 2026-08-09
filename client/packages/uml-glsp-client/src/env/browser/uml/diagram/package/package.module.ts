/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { representationTypeId } from '@borkdominik-biguml/uml-glsp-server';
import { configureModelElement, FeatureModule, GEdge, PolylineEdgeView } from '@eclipse-glsp/client';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import { GPackageMergeEdge, GPackageMergeEdgeView, NamedElement, NamedElementView } from '../../elements/index.js';

const R = 'Package';

export const umlPackageDiagramModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    // Nodes
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Class'), NamedElement, NamedElementView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Class'), GClassNode, GClassNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Package'), NamedElement, NamedElementView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Package'), GPackageNode, GPackageNodeView);

    // Edges
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'Abstraction'), GEdge, PolylineEdgeView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'Abstraction'), GAbstractionEdge, GAbstractionEdgeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'Dependency'), GEdge, PolylineEdgeView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'Dependency'), GDependencyEdge, GDependencyEdgeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'ElementImport'), GEdge, PolylineEdgeView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'ElementImport'), GElementImportEdge, GElementImportEdgeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'PackageImport'), GEdge, PolylineEdgeView);
    // configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'PackageImport'), GPackageImportEdge, GPackageImportEdgeView);
    // Its own class rather than a plain edge, as in the class diagram: the router picks the merges out
    // by it, to draw the ones running into the same package as branches off a single connector.
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'PackageMerge'), GPackageMergeEdge, GPackageMergeEdgeView);
});
