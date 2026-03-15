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
import { ClassDiagramNodeTypes, CommonModelTypes } from '@borkdominik-biguml/uml-glsp-server';
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
import { GClassNode } from '../elements/class.element.js';
import { GEnumerationNode } from '../elements/enumeration.element.js';
import { GInterfaceNode } from '../elements/interface.element.js';
import { GOperationNode } from '../elements/operation.element.js';
import { GPackageNode } from '../elements/package.element.js';
import { GPropertyNode } from '../elements/property.element.js';

@injectable()
export class UmlDiagramConfiguration implements DiagramConfiguration {
    get typeMapping(): Map<string, GModelElementConstructor> {
        const mapping = getDefaultMapping();
        mapping.set(CommonModelTypes.LABEL_HEADING, GLabel);
        mapping.set(CommonModelTypes.LABEL_TEXT, GLabel);
        mapping.set(CommonModelTypes.COMP_HEADER, GCompartment);
        mapping.set(CommonModelTypes.LABEL_ICON, GLabel);
        mapping.set(CommonModelTypes.ICON, GCompartment);
        mapping.set(ClassDiagramNodeTypes.CLASS, GClassNode);
        mapping.set(ClassDiagramNodeTypes.ABSTRACT_CLASS, GClassNode);
        mapping.set(ClassDiagramNodeTypes.PROPERTY, GPropertyNode);
        mapping.set(ClassDiagramNodeTypes.OPERATION, GOperationNode);
        mapping.set(ClassDiagramNodeTypes.INTERFACE, GInterfaceNode);
        mapping.set(ClassDiagramNodeTypes.ENUMERATION, GEnumerationNode);
        mapping.set(ClassDiagramNodeTypes.ENUMERATION_LITERAL, GEnumerationNode);
        mapping.set(ClassDiagramNodeTypes.PACKAGE, GPackageNode);
        return mapping;
    }

    get shapeTypeHints(): ShapeTypeHint[] {
        return [
            {
                elementTypeId: ClassDiagramNodeTypes.CLASS,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: [ClassDiagramNodeTypes.PROPERTY, ClassDiagramNodeTypes.OPERATION]
            },
            {
                elementTypeId: ClassDiagramNodeTypes.PACKAGE,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: [
                    ClassDiagramNodeTypes.ABSTRACT_CLASS,
                    ClassDiagramNodeTypes.CLASS,
                    ClassDiagramNodeTypes.DATA_TYPE,
                    ClassDiagramNodeTypes.ENUMERATION,
                    ClassDiagramNodeTypes.INTERFACE,
                    ClassDiagramNodeTypes.PACKAGE,
                    ClassDiagramNodeTypes.PRIMITIVE_TYPE
                ]
            },
            {
                elementTypeId: ClassDiagramNodeTypes.ABSTRACT_CLASS,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: [ClassDiagramNodeTypes.PROPERTY, ClassDiagramNodeTypes.OPERATION]
            },
            {
                elementTypeId: ClassDiagramNodeTypes.INTERFACE,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: [ClassDiagramNodeTypes.PROPERTY, ClassDiagramNodeTypes.OPERATION]
            },
            {
                elementTypeId: ClassDiagramNodeTypes.ENUMERATION,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: [ClassDiagramNodeTypes.ENUMERATION_LITERAL]
            },
            {
                elementTypeId: ClassDiagramNodeTypes.INSTANCE_SPECIFICATION,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: [ClassDiagramNodeTypes.SLOT]
            },
            {
                elementTypeId: ClassDiagramNodeTypes.PRIMITIVE_TYPE,
                repositionable: true,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: []
            },
            {
                elementTypeId: ClassDiagramNodeTypes.SLOT,
                repositionable: false,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: []
            },
            {
                elementTypeId: ClassDiagramNodeTypes.ENUMERATION_LITERAL,
                repositionable: false,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: []
            },
            {
                elementTypeId: ClassDiagramNodeTypes.OPERATION,
                repositionable: false,
                deletable: true,
                resizable: true,
                reparentable: false,
                containableElementTypeIds: []
            },
            {
                elementTypeId: ClassDiagramNodeTypes.PROPERTY,
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
        sourceElementTypeIds: [ClassDiagramNodeTypes.CLASS, ClassDiagramNodeTypes.ABSTRACT_CLASS, ClassDiagramNodeTypes.INTERFACE],
        targetElementTypeIds: [ClassDiagramNodeTypes.CLASS, ClassDiagramNodeTypes.ABSTRACT_CLASS, ClassDiagramNodeTypes.INTERFACE]
    };
}
