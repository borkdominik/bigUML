import type { DiagramSerializer, ModelService } from '@borkdominik-biguml/model-service';
import { DefaultModelState, GModelIndex } from '@eclipse-glsp/server';
import { AstNode } from 'langium';
import type { Diagram } from '../../../language-server/generated/ast.js';
import type { QualifiedNameProvider } from '../../../language-server/yo-generated/uml-naming.js';

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
