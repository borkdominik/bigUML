// common/provider/abstract-diagram-command-palette.ts
import {
    Args,
    CommandPaletteActionProvider,
    CreateEdgeOperation,
    DefaultTypes,
    DeleteElementOperation,
    GModelElement,
    GModelElementConstructor,
    GNode,
    LabeledAction,
    Point
} from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { BaseDiagramModelState } from '../model/base-diagram-model-state.js';

@injectable()
export abstract class AbstractDiagramCommandPaletteActionProvider<
    NodeT extends GNode,
    StateT extends BaseDiagramModelState
> extends CommandPaletteActionProvider {
    abstract override readonly modelState: StateT;

    protected abstract readonly nodeCtor: GModelElementConstructor<NodeT>;

    protected abstract getGeneralCreateNodeActions(location: Point): LabeledAction[];

    protected getEdgeElementTypeId(): string {
        return DefaultTypes.EDGE;
    }

    protected getLabel(node: GNode): string {
        return node.id;
    }

    protected getEdgeCandidates(): NodeT[] {
        return this.modelState.index.getAllByClass(this.nodeCtor) as NodeT[];
    }

    getPaletteActions(selectedElementIds: string[], selectedElements: GModelElement[], position: Point, args?: Args): LabeledAction[] {
        const actions: LabeledAction[] = [];
        if (this.modelState.isReadonly) {
            return actions;
        }

        const location = position ?? Point.ORIGIN;

        actions.push(...this.getGeneralCreateNodeActions(location));

        if (selectedElements.length === 1) {
            const element = selectedElements[0];
            if (element instanceof GNode) {
                actions.push(...this.createEdgeActions(element, this.getEdgeCandidates()));
            }
        } else if (selectedElements.length === 2) {
            const [source, target] = selectedElements;
            if (source instanceof this.nodeCtor && target instanceof this.nodeCtor) {
                actions.push(
                    this.createEdgeAction(`Create Edge from ${this.getLabel(source)} to ${this.getLabel(target)}`, source, target)
                );
            }
        }

        const delLabel = selectedElementIds.length === 1 ? 'Delete' : 'Delete All';
        actions.push({
            label: delLabel,
            actions: [DeleteElementOperation.create(selectedElementIds)],
            icon: 'fa-minus-square'
        });

        return actions;
    }

    protected createEdgeActions(source: GNode, targets: GNode[]): LabeledAction[] {
        const actions: LabeledAction[] = [];
        for (const node of targets) {
            actions.push(this.createEdgeAction(`Create Edge to ${this.getLabel(node)}`, source, node));
        }
        return actions;
    }

    protected createEdgeAction(label: string, source: GNode, node: GNode): LabeledAction {
        return {
            label,
            actions: [
                CreateEdgeOperation.create({
                    elementTypeId: this.getEdgeElementTypeId(),
                    sourceElementId: source.id,
                    targetElementId: node.id
                })
            ],
            icon: 'fa-plus-square'
        };
    }
}
