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

export namespace QualifiedUtil {
    export function representationName(representation: UmlDiagramType, name: string): string {
        return `${representation.toLowerCase()}__${name}`;
    }

    export function representationTypeId(representation: UmlDiagramType, type: string, name: string): string {
        return `${type}:${representation.toLowerCase()}__${name}`;
    }

    export function representationTemplateTypeId(representation: UmlDiagramType, type: string, template: string, name: string): string {
        return `${type}:${representation.toLowerCase()}__${template}__${name}`;
    }
}
