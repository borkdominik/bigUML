/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { UmlDiagramType } from '@borkdominik-biguml/biguml-protocol';

export namespace QualifiedUtil {
    export function representationTypeId(representation: UmlDiagramType, type: string, name: string): string {
        return `${type}:${representation.toLowerCase()}__${name}`;
    }

    export function representationTemplateTypeId(representation: UmlDiagramType, type: string, template: string, name: string): string {
        return `${type}:${representation.toLowerCase()}__${template}__${name}`;
    }
}
