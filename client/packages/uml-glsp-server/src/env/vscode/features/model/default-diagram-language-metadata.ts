/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { inject, injectable, multiInject } from 'inversify';
import { type DiagramLanguageMetadata } from './diagram-language-metadata.js';
import { DiagramModelState } from './diagram-model-state.js';
import { DiagramServices, findDiagramServices } from './diagram-services.js';

/**
 * Default implementation of {@link DiagramLanguageMetadata} that delegates all calls
 * to the metadata of the diagram type currently loaded in the model state.
 */
@injectable()
export class DefaultDiagramLanguageMetadata implements DiagramLanguageMetadata {
    @inject(DiagramModelState)
    protected readonly modelState: DiagramModelState;

    @multiInject(DiagramServices)
    protected readonly diagramServices: DiagramServices[];

    protected get current(): DiagramLanguageMetadata | undefined {
        return findDiagramServices(this.diagramServices, this.modelState.diagramType)?.languageMetadata;
    }

    get nodeTypeIds(): string[] {
        return this.current?.nodeTypeIds ?? [];
    }

    get edgeTypeIds(): string[] {
        return this.current?.edgeTypeIds ?? [];
    }

    convertToAst(elementTypeId: string): string {
        if (!this.current) {
            throw new Error('No diagram type loaded, cannot convert element type id to AST type');
        }
        return this.current.convertToAst(elementTypeId);
    }

    convertToElementType(astType: string): string {
        if (!this.current) {
            throw new Error('No diagram type loaded, cannot convert AST type to element type id');
        }
        return this.current.convertToElementType(astType);
    }
}
