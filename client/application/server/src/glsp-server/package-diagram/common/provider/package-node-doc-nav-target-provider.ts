import { inject, injectable } from 'inversify';
import { AbstractNodeDocumentationNavigationTargetProvider } from '../../../common/provider/abstract-node-doc-nav-target-provider.js';
import { GPackageClassNode } from '../../model/elements/class.graph-extension.js';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';

@injectable()
export class PackageDiagramNodeDocumentationNavigationTargetProvider extends AbstractNodeDocumentationNavigationTargetProvider<
    GPackageClassNode,
    PackageDiagramModelState
> {
    @inject(PackageDiagramModelState)
    override readonly modelState!: PackageDiagramModelState;

    protected readonly nodeCtor = GPackageClassNode;
}
