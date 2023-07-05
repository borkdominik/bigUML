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
import { PolylineEdgeView, SEdge, configureModelElement } from '@eclipse-glsp/client/lib';
import { ContainerModule } from 'inversify';
import { NamedElement, NamedElementView } from '../../elements';
import { PackageElement } from './elements/package-element.model';
import { PackageElementView } from './elements/package-element.view';
import { UmlPackageTypes } from './package.types';

const usePackageFolderView = false;

export const umlPackageDiagramModule = new ContainerModule((bind, undbind, isBound, rebind) => {
    const context = { bind, undbind, isBound, rebind };

    if (usePackageFolderView) {
        configureModelElement(context, UmlPackageTypes.PACKAGE, PackageElement, PackageElementView);
    } else {
        configureModelElement(context, UmlPackageTypes.PACKAGE, NamedElement, NamedElementView);
    }

    configureModelElement(context, UmlPackageTypes.CLASS, NamedElement, NamedElementView);
    configureModelElement(context, UmlPackageTypes.DEPENDENCY, SEdge, PolylineEdgeView);
    configureModelElement(context, UmlPackageTypes.PACKAGE_IMPORT, SEdge, PolylineEdgeView);
    configureModelElement(context, UmlPackageTypes.PACKAGE_MERGE, SEdge, PolylineEdgeView);
    configureModelElement(context, UmlPackageTypes.ELEMENT_IMPORT, SEdge, PolylineEdgeView);
});
