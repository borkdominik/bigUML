/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { representationTypeId } from '@borkdominik-biguml/uml-glsp-server';
import { configureModelElement, FeatureModule } from '@eclipse-glsp/client';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import {
    GAbstractionEdge,
    GAbstractionEdgeView,
    GClassNode,
    GClassNodeView,
    GDependencyEdge,
    GDependencyEdgeView,
    GElementImportEdge,
    GElementImportEdgeView,
    GPackageImportEdge,
    GPackageImportEdgeView,
    GPackageMergeEdge,
    GPackageMergeEdgeView,
    GPackageNode,
    GPackageNodeView
} from '../../elements/index.js';

const R = 'Package';

export const umlPackageDiagramModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };

    // Nodes
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Class'), GClassNode, GClassNodeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.NODE, 'Package'), GPackageNode, GPackageNodeView);

    // Edges
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'Abstraction'), GAbstractionEdge, GAbstractionEdgeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'Dependency'), GDependencyEdge, GDependencyEdgeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'ElementImport'), GElementImportEdge, GElementImportEdgeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'PackageImport'), GPackageImportEdge, GPackageImportEdgeView);
    configureModelElement(context, representationTypeId(R, DefaultTypes.EDGE, 'PackageMerge'), GPackageMergeEdge, GPackageMergeEdgeView);
});
