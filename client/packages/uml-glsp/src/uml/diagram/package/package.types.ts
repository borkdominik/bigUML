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
import { UmlDiagramType } from '@borkdominik-biguml/uml-common';
import { DefaultTypes } from '@eclipse-glsp/client';
import { QualifiedUtil } from '../../qualified.utils';

export namespace UmlPackageTypes {
    export const CLASS = QualifiedUtil.representationTypeId(UmlDiagramType.PACKAGE, DefaultTypes.NODE, 'Class');
    export const PACKAGE = QualifiedUtil.representationTypeId(UmlDiagramType.PACKAGE, DefaultTypes.NODE, 'Package');
    export const DEPENDENCY = QualifiedUtil.representationTypeId(UmlDiagramType.PACKAGE, DefaultTypes.EDGE, 'Dependency');
    export const ELEMENT_IMPORT = QualifiedUtil.representationTypeId(UmlDiagramType.PACKAGE, DefaultTypes.EDGE, 'ElementImport');
    export const PACKAGE_IMPORT = QualifiedUtil.representationTypeId(UmlDiagramType.PACKAGE, DefaultTypes.EDGE, 'PackageImport');
    export const PACKAGE_MERGE = QualifiedUtil.representationTypeId(UmlDiagramType.PACKAGE, DefaultTypes.EDGE, 'PackageMerge');
}
