/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { type UMLDiagramType } from '@borkdominik-biguml/uml-protocol';

export namespace QualifiedUtil {
    export function typeId(representation: UMLDiagramType, id: string): string {
        return `${representation}__${id}`;
    }

    export function representationTypeId(representation: UMLDiagramType, type: string, name: string): string {
        return `${type}:${representation.toLowerCase()}__${name}`;
    }

    export function representationTemplateTypeId(representation: UMLDiagramType, type: string, template: string, name: string): string {
        return `${type}:${representation.toLowerCase()}__${template}__${name}`;
    }
}
