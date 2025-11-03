// diagrams/package/package-context-menu-item-provider.ts
import { inject, injectable } from 'inversify';
import { AbstractDiagramContextMenuItemProvider, CreateNodeDescriptor } from '../../../common/provider/abstract-context-menu.js';
import { PackageDiagramModelState } from '../../model/package-diagram-model-state.js';
import { ModelTypes } from '../util/model-types.js';

@injectable()
export class PackageDiagramContextMenuItemProvider extends AbstractDiagramContextMenuItemProvider<PackageDiagramModelState> {
    @inject(PackageDiagramModelState)
    readonly modelState!: PackageDiagramModelState;

    protected getCreateNodeDescriptors(): CreateNodeDescriptor[] {
        return [
            { id: 'newClass', label: 'Class', elementTypeId: ModelTypes.CLASS, icon: 'fa-class' }
            // Add more later if needed
        ];
    }
}
