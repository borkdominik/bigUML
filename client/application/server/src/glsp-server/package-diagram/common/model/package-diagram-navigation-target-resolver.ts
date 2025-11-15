// navigation/package-diagram-navigation-target-resolver.ts
import { inject, injectable } from 'inversify';
import { AbstractByNameNavigationTargetResolver } from '../../../common/model/base-navigation-target-resolver.js';
import { GPackageClassNode } from '../../model/elements/class.graph-extension.js';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';

@injectable()
export class PackageDiagramNavigationTargetResolver extends AbstractByNameNavigationTargetResolver<GPackageClassNode> {
    @inject(PackageDiagramModelState)
    override readonly modelState!: PackageDiagramModelState;

    protected readonly nodeCtor = GPackageClassNode;
}
