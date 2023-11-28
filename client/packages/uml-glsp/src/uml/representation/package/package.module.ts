/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { UmlDiagramType } from '@borkdominik-biguml/uml-common';
import { ContainerModule } from 'inversify';
import {
    registerAbstractionElement,
    registerClassElement,
    registerDependencyElement,
    registerElementImportElement,
    registerPackageElement,
    registerPackageImportElement,
    registerPackageMergeElement
} from '../../elements/index';

export const umlPackageDiagramModule = new ContainerModule((bind, undbind, isBound, rebind) => {
    const context = { bind, undbind, isBound, rebind };

    registerClassElement(context, UmlDiagramType.PACKAGE);
    registerPackageElement(context, UmlDiagramType.PACKAGE);

    registerAbstractionElement(context, UmlDiagramType.PACKAGE);
    registerDependencyElement(context, UmlDiagramType.PACKAGE);
    registerElementImportElement(context, UmlDiagramType.PACKAGE);
    registerPackageImportElement(context, UmlDiagramType.PACKAGE);
    registerPackageMergeElement(context, UmlDiagramType.PACKAGE);
});
