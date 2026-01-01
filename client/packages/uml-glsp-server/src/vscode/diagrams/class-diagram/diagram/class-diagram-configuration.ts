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
import { DefaultTypes, type EdgeTypeHint, type ShapeTypeHint } from '@eclipse-glsp/protocol';
import {
    type DiagramConfiguration,
    GCompartment,
    GLabel,
    type GModelElementConstructor,
    ServerLayoutKind,
    getDefaultMapping
} from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { ModelTypes as types } from '../common/util/model-types.js';
import { GClassNode } from '../model/elements/class.graph-extension.js';
import { GEnumerationNode } from '../model/elements/enumeration.graph-extension.js';
import { GInterfaceNode } from '../model/elements/interface.graph-extension.js';
import { GOperationNode } from '../model/elements/operation.graph-extension.js';
import { GPackageNode } from '../model/elements/package.graph-extension.js';
import { GPropertyNode } from '../model/elements/property.graph-extension.js';

@injectable()
export class ClassDiagramConfiguration implements DiagramConfiguration {
    get typeMapping(): Map<string, GModelElementConstructor> {
        const mapping = getDefaultMapping();
        mapping.set(types.LABEL_HEADING, GLabel);
        mapping.set(types.LABEL_TEXT, GLabel);
        mapping.set(types.COMP_HEADER, GCompartment);
        mapping.set(types.LABEL_ICON, GLabel);
        mapping.set(types.ICON, GCompartment);
        mapping.set(types.CLASS, GClassNode);
        mapping.set(types.ABSTRACT_CLASS, GClassNode);
        mapping.set(types.PROPERTY, GPropertyNode);
        mapping.set(types.OPERATION, GOperationNode);
        mapping.set(types.INTERFACE, GInterfaceNode);
        mapping.set(types.ENUMERATION, GEnumerationNode);
        mapping.set(types.ENUMERATION_LITERAL, GEnumerationNode);
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
                containableElementTypeIds: [types.PROPERTY, types.OPERATION]
            },
            {
                elementTypeId: types.PACKAGE,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: [
                    types.ABSTRACT_CLASS,
                    types.CLASS,
                    types.DATA_TYPE,
                    types.ENUMERATION,
                    types.INTERFACE,
                    types.PACKAGE,
                    types.PRIMITIVE_TYPE
                ]
            },
            {
                elementTypeId: types.ABSTRACT_CLASS,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: [types.PROPERTY, types.OPERATION]
            },
            {
                elementTypeId: types.INTERFACE,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: [types.PROPERTY, types.OPERATION]
            },
            {
                elementTypeId: types.ENUMERATION,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: [types.ENUMERATION_LITERAL]
            },
            {
                elementTypeId: types.INSTANCE_SPECIFICATION,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: [types.SLOT]
            },
            {
                elementTypeId: types.PRIMITIVE_TYPE,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: []
            },
            {
                elementTypeId: types.SLOT,
                repositionable: false,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: []
            },
            {
                elementTypeId: types.ENUMERATION_LITERAL,
                repositionable: false,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: []
            },
            {
                elementTypeId: types.OPERATION,
                repositionable: false,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: []
            },
            {
                elementTypeId: types.PROPERTY,
                repositionable: false,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: []
            }
        ];
    }

    get edgeTypeHints(): EdgeTypeHint[] {
        return [createDefaultEdgeTypeHint(DefaultTypes.EDGE)];
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
        sourceElementTypeIds: [types.CLASS, types.ABSTRACT_CLASS, types.INTERFACE],
        targetElementTypeIds: [types.CLASS, types.ABSTRACT_CLASS, types.INTERFACE]
    };
}
