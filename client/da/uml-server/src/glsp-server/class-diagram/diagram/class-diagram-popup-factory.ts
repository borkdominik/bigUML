import { injectable } from 'inversify';
import { AbstractPopupFactory } from '../../common/provider/abstract-popup-factory.js';
import { GClassNode } from '../model/elements/class.graph-extension.js';

@injectable()
export class ClassDiagramPopupFactory extends AbstractPopupFactory<GClassNode> {
    protected readonly nodeCtor = GClassNode;

    //to customize, override getTitleText/getBodyHtml
}
