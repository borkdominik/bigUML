import { CreateNodeOperation, LabeledAction, Point } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { AbstractDiagramCommandPaletteActionProvider } from '../../../common/provider/abstract-diagram-command-palette.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';
import { GClassNode } from '../../model/elements/class.graph-extension.js';
import { ModelTypes } from '../util/model-types.js';

@injectable()
export class ClassDiagramCommandPaletteActionProvider extends AbstractDiagramCommandPaletteActionProvider<
    GClassNode,
    ClassDiagramModelState
> {
    @inject(ClassDiagramModelState)
    override readonly modelState!: ClassDiagramModelState;

    protected readonly nodeCtor = GClassNode;

    protected getGeneralCreateNodeActions(location: Point): LabeledAction[] {
        return [
            {
                label: 'Create Class',
                actions: [CreateNodeOperation.create(ModelTypes.CLASS, { location })],
                icon: 'fa-plus-square'
            },
            {
                label: 'Create Abstract Class',
                actions: [CreateNodeOperation.create(ModelTypes.ABSTRACT_CLASS, { location })],
                icon: 'fa-plus-square'
            },
            {
                label: 'Create Property',
                actions: [CreateNodeOperation.create(ModelTypes.PROPERTY, { location })],
                icon: 'fa-plus-square'
            }
        ];
    }
}
