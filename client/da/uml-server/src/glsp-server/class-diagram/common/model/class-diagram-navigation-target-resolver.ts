// navigation/class-diagram-navigation-target-resolver.ts
import { inject, injectable } from 'inversify';
import { AbstractByNameNavigationTargetResolver } from '../../../common/model/base-navigation-target-resolver.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';
import { GClassNode } from '../../model/elements/class.graph-extension.js';

@injectable()
export class ClassDiagramNavigationTargetResolver extends AbstractByNameNavigationTargetResolver<GClassNode> {
    @inject(ClassDiagramModelState)
    override readonly modelState!: ClassDiagramModelState;

    protected readonly nodeCtor = GClassNode;
}
