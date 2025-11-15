import {
    GModelElement,
    GModelElementConstructor,
    GModelRoot,
    GPreRenderedElement,
    PopupModelFactory,
    RequestPopupModelAction
} from '@eclipse-glsp/server';
import { injectable } from 'inversify';

@injectable()
export abstract class AbstractPopupFactory<NodeT extends GModelElement> implements PopupModelFactory {
    protected abstract readonly nodeCtor: GModelElementConstructor<NodeT>;

    protected getRootType(_node: NodeT): string {
        return 'html';
    }
    protected getRootId(_node: NodeT): string {
        return 'sprotty-popup';
    }

    protected getTitleId(_node: NodeT): string {
        return 'popup-title';
    }
    protected getBodyId(_node: NodeT): string {
        return 'popup-body';
    }

    protected getTitleText(node: NodeT): string {
        const anyNode = node as unknown as { name?: string; id: string };
        return anyNode.name ?? anyNode.id;
    }

    protected getBodyHtml(_node: NodeT): string {
        return `<div class="sprotty-popup-body"></div>`;
    }

    protected getTitleHtml(node: NodeT): string {
        return `<div class="sprotty-popup-title">${this.getTitleText(node)}</div>`;
    }

    protected getExtraElements(_node: NodeT): GPreRenderedElement[] {
        return [];
    }

    createPopupModel(element: GModelElement, action: RequestPopupModelAction): GModelRoot | undefined {
        if (!(element instanceof this.nodeCtor)) return undefined;

        const node = element as NodeT;

        const titleEl = GPreRenderedElement.builder().id(this.getTitleId(node)).code(this.getTitleHtml(node)).build();

        const bodyEl = GPreRenderedElement.builder().id(this.getBodyId(node)).code(this.getBodyHtml(node)).build();

        const rootBuilder = GModelRoot.builder()
            .type(this.getRootType(node))
            .canvasBounds(action.bounds)
            .id(this.getRootId(node))
            .add(titleEl)
            .add(bodyEl);

        for (const extra of this.getExtraElements(node)) {
            rootBuilder.add(extra);
        }

        return rootBuilder.build();
    }
}
