/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { isIdAstNode, type IdAstNode } from '@borkdominik-biguml/uml-model-server';
import { validateNode } from '@borkdominik-biguml/uml-model-server/validation';
import { MarkerKind, ModelState, type GModelElement, type Marker, type ModelValidator } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { streamAst } from 'langium';
import type { UmlDiagramModelState } from '../model/diagram-model-state.js';

@injectable()
export class GenericDiagramModelValidator implements ModelValidator {
    @inject(ModelState)
    protected readonly modelState: UmlDiagramModelState;

    validate(_elements: GModelElement[]): Marker[] {
        const markers: Marker[] = [];
        const semanticRoot = this.modelState.semanticRoot;

        for (const node of streamAst(semanticRoot)) {
            if (!isIdAstNode(node)) {
                continue;
            }

            try {
                validateNode(node);
            } catch (error) {
                markers.push(...this.createMarkers(node, error));
            }
        }

        return markers;
    }

    protected createMarkers(node: IdAstNode, error: unknown): Marker[] {
        const message = error instanceof Error ? error.message : String(error);
        const description = message.replace(/^Validation error:\s*/, '');

        return description.split(', ').map(msg => ({
            kind: MarkerKind.ERROR as Marker['kind'],
            elementId: node.__id,
            label: 'Validation Error',
            description: msg.trim()
        }));
    }
}
