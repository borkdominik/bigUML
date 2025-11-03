// package/popup/package-diagram-popup-factory.ts
import { injectable } from 'inversify';
import { AbstractPopupFactory } from '../../common/provider/abstract-popup-factory.js';
import { GPackageClassNode } from '../model/elements/class.graph-extension.js';

@injectable()
export class PackageDiagramPopupFactory extends AbstractPopupFactory<GPackageClassNode> {
    protected readonly nodeCtor = GPackageClassNode;
}
