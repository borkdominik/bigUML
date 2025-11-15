import { GEdge, GNode } from '@eclipse-glsp/graph';
import { Args, EditorContext, NavigationTarget } from '@eclipse-glsp/protocol';
import { GModelElementConstructor, NavigationTargetProvider } from '@eclipse-glsp/server';
import { BaseDiagramModelState } from '../model/base-diagram-model-state.js';

type Direction = 'next' | 'previous';

export abstract class AbstractNextOrPreviousNavigationTargetProvider<Node extends GNode> implements NavigationTargetProvider {
    abstract readonly targetTypeId: Direction;
    abstract readonly modelState: BaseDiagramModelState;
    protected abstract readonly nodeCtor: GModelElementConstructor<Node>;
    protected abstract readonly direction: Direction;

    getTargets(editorContext: EditorContext): NavigationTarget[] {
        const srcUri = this.modelState.sourceUri ?? '';
        const ids = new Set<string>();

        for (const id of editorContext.selectedElementIds ?? []) {
            const el = this.modelState.index.get(id);
            if (el && el instanceof this.nodeCtor) {
                const edges = this.collectEdges(el as Node);
                for (const e of edges) {
                    const endpoint = this.getEdgeEndpointId(e);
                    if (endpoint) ids.add(endpoint);
                }
            }
        }

        return [...ids].map(id => this.toNavigationTarget(srcUri, id));
    }

    // now implemented once based on direction
    protected collectEdges(node: Node): GEdge[] {
        return this.direction === 'next' ? this.modelState.index.getOutgoingEdges(node) : this.modelState.index.getIncomingEdges(node);
    }

    protected getEdgeEndpointId(edge: GEdge): string {
        return this.direction === 'next' ? edge.targetId : edge.sourceId;
    }

    protected toNavigationTarget(sourceURI: string, id: string): NavigationTarget {
        return { uri: sourceURI, args: this.toArgs(id) };
    }

    protected toArgs(id: string): Args {
        return { [NavigationTarget.ELEMENT_IDS]: id };
    }
}
