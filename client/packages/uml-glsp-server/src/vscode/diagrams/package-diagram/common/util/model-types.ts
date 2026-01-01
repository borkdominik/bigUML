/********************************************************************************
 * Copyright (c) 2022-2023 STMicroelectronics and others.
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

import { DefaultTypes } from '@eclipse-glsp/server';

export namespace ModelTypes {
    export const LABEL_HEADING = 'label:heading';
    export const LABEL_NAME = 'label:name';
    export const LABEL_TEXT = 'label:text';
    export const COMP_HEADER = 'comp:header';
    export const LABEL_ICON = 'label:icon';
    export const EDGE = 'edge';
    export const ICON = 'icon';
    export const DIVIDER = 'divider';

    // container types
    export const CLASS = representationTypeId('Package', DefaultTypes.NODE, 'Class');
    export const PACKAGE = representationTypeId('Package', DefaultTypes.NODE, 'Package');
    // relation types
    export const ABSTRACTION = representationTypeId('Package', DefaultTypes.EDGE, 'Abstraction');
    export const DEPENDENCY = representationTypeId('Package', DefaultTypes.EDGE, 'Dependency');
    export const ELEMENT_IMPORT = representationTypeId('Package', DefaultTypes.EDGE, 'ElementImport');
    export const PACKAGE_IMPORT = representationTypeId('Package', DefaultTypes.EDGE, 'PackageImport');
    export const PACKAGE_MERGE = representationTypeId('Package', DefaultTypes.EDGE, 'PackageMerge');
    export const USAGE = representationTypeId('Package', DefaultTypes.EDGE, 'Usage');

    export const STRUCTURE = 'struct';

    export const MISSING_NODE = 'missingNode';
}

function representationTypeId(representation: string, type: string, name: string): string {
    return `${type}:${representation.toLowerCase()}__${name}`;
}
