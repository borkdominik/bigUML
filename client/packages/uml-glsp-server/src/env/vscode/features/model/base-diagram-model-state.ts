/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { DiagramSerializer, ModelService, QualifiedNameProvider } from '@borkdominik-biguml/model-server';
import type { Diagram } from '@borkdominik-biguml/model-server/grammar';
import { DefaultModelState, type GModelIndex } from '@eclipse-glsp/server';
import { type AstNode } from 'langium';

export interface BigUmlModelIndex extends GModelIndex {
    findSemanticElement<T extends AstNode>(id: string, guard: (item: unknown) => item is T): T;

    findSemanticElement<T extends AstNode = AstNode>(id: string, guard?: (item: unknown) => item is T): T | undefined;

    findIdElement(id: string): any;

    findPath(id: string): string | undefined;

    findPositionPath(id: string): string | undefined;

    findSizePath(id: string): string | undefined;
}

export abstract class BaseDiagramModelState extends DefaultModelState {
    abstract override index: BigUmlModelIndex;
    abstract semanticUri: string;
    abstract semanticRoot: Diagram;
    abstract modelService: ModelService;
    abstract semanticSerializer: DiagramSerializer<Diagram>;
    abstract nameProvider: QualifiedNameProvider;

    abstract sendModelPatch(patch: string): Promise<void>;
    abstract redo(): Promise<void>;
    abstract undo(): Promise<void>;
}
