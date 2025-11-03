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
import { EdgeTypeHint, ShapeTypeHint } from '@eclipse-glsp/protocol';
import {
    DiagramConfiguration,
    GCompartment,
    GLabel,
    GModelElementConstructor,
    ServerLayoutKind,
    getDefaultMapping
} from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { ModelTypes as types } from '../common/util/model-types.js';
import { GPackageClassNode } from '../model/elements/class.graph-extension.js';
import { GPackageNode } from '../model/elements/package.graph-extension.js';

@injectable()
export class PackageDiagramConfiguration implements DiagramConfiguration {
    get typeMapping(): Map<string, GModelElementConstructor> {
        const mapping = getDefaultMapping();
        mapping.set(types.LABEL_HEADING, GLabel);
        mapping.set(types.LABEL_TEXT, GLabel);
        mapping.set(types.COMP_HEADER, GCompartment);
        mapping.set(types.LABEL_ICON, GLabel);
        mapping.set(types.ICON, GCompartment);
        mapping.set(types.CLASS, GPackageClassNode);
        mapping.set(types.PACKAGE, GPackageNode);
        return mapping;
    }

    get shapeTypeHints(): ShapeTypeHint[] {
        return [
            {
                elementTypeId: types.CLASS,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: []
            },
            {
                elementTypeId: types.PACKAGE,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: [types.PACKAGE, types.CLASS]
            }
        ];
    }

    get edgeTypeHints(): EdgeTypeHint[] {
        return [
            {
                elementTypeId: types.ABSTRACTION,
                repositionable: true,
                deletable: true,
                routable: true,
                sourceElementTypeIds: [types.CLASS],
                targetElementTypeIds: [types.CLASS]
            },
            {
                elementTypeId: types.DEPENDENCY,
                repositionable: true,
                deletable: true,
                routable: true,
                sourceElementTypeIds: [types.CLASS],
                targetElementTypeIds: [types.CLASS]
            },
            {
                elementTypeId: types.ELEMENT_IMPORT,
                repositionable: true,
                deletable: true,
                routable: true,
                sourceElementTypeIds: [types.PACKAGE],
                targetElementTypeIds: [types.CLASS, types.PACKAGE]
            },
            {
                elementTypeId: types.PACKAGE_IMPORT,
                repositionable: true,
                deletable: true,
                routable: true,
                sourceElementTypeIds: [types.PACKAGE],
                targetElementTypeIds: [types.PACKAGE]
            },
            {
                elementTypeId: types.PACKAGE_MERGE,
                repositionable: true,
                deletable: true,
                routable: true,
                sourceElementTypeIds: [types.PACKAGE],
                targetElementTypeIds: [types.PACKAGE]
            },
            {
                elementTypeId: types.USAGE,
                repositionable: true,
                deletable: true,
                routable: true,
                sourceElementTypeIds: [types.PACKAGE, types.CLASS],
                targetElementTypeIds: [types.PACKAGE, types.CLASS]
            }
        ];
    }

    layoutKind = ServerLayoutKind.MANUAL;
    needsClientLayout = true;
    animatedUpdate = true;
}

export function createDefaultShapeTypeHint(elementId: string): ShapeTypeHint {
    return {
        elementTypeId: elementId,
        repositionable: true,
        deletable: true,
        resizable: true,
        reparentable: true
    };
}

export function createDefaultEdgeTypeHint(elementId: string): EdgeTypeHint {
    return {
        elementTypeId: elementId,
        repositionable: true,
        deletable: true,
        routable: true,
        sourceElementTypeIds: [types.CLASS, types.PACKAGE],
        targetElementTypeIds: [types.CLASS, types.PACKAGE]
    };
}
