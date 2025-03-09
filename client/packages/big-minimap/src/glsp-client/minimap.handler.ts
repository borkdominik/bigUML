/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { MinimapExportSvgAction, RequestMinimapExportSvgAction } from '@borkdominik-biguml/big-minimap';
import {
    type Action,
    Bounds,
    type CommandExecutionContext,
    type CommandResult,
    EditorContextService,
    GLSPSvgExporter,
    type GModelElement,
    GModelRoot,
    HiddenCommand,
    type IVNodePostprocessor,
    type RequestExportSvgAction,
    TYPES,
    isBoundsAware,
    isExportable,
    isHoverable,
    isSelectable,
    isViewport
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { type VNode } from 'snabbdom';

// The following implementation follows the standard implementation
// https://github.com/eclipse-glsp/glsp-client/blob/master/packages/client/src/features/export/glsp-svg-exporter.ts

@injectable()
export class MinimapGLSPSvgExporter extends GLSPSvgExporter {
    @inject(EditorContextService)
    protected readonly editorContext: EditorContextService;

    override export(root: GModelRoot, request?: RequestExportSvgAction): void {
        if (typeof document !== 'undefined') {
            let svgElement = this.findSvgElement();
            if (svgElement) {
                svgElement = this.prepareSvgElement(svgElement, root, request);
                const serializedSvg = this.createSvg(svgElement, root, request?.options ?? {}, request);
                const svgExport = this.getSvgExport(serializedSvg, svgElement, root, request);
                const bounds = this.getBounds(root);
                // do not give request/response id here as otherwise the action is treated as an unrequested response
                this.actionDispatcher.dispatch(
                    MinimapExportSvgAction.create({
                        svg: svgExport,
                        elementId: root.id,
                        bounds: {
                            x: bounds.x,
                            y: bounds.y,
                            width: bounds.width,
                            height: bounds.height
                        }
                    })
                );
            }
        }
    }

    protected override getBounds(root: GModelRoot) {
        const svgElement = this.findSvgElement();
        if (svgElement) {
            return svgElement.getBBox();
        }

        const allBounds: Bounds[] = [Bounds.EMPTY];
        root.children.forEach(element => {
            if (isBoundsAware(element)) {
                allBounds.push(element.bounds);
            }
        });
        return allBounds.reduce((one, two) => Bounds.combine(one, two));
    }
}

export class MinimapExportSvgCommand extends HiddenCommand {
    static readonly KIND = RequestMinimapExportSvgAction.KIND;

    constructor(@inject(TYPES.Action) protected action: RequestMinimapExportSvgAction) {
        super();
    }

    execute(context: CommandExecutionContext): CommandResult {
        if (isExportable(context.root)) {
            const root = context.modelFactory.createRoot(context.root);
            if (isExportable(root)) {
                if (isViewport(root)) {
                    root.zoom = 1;
                    root.scroll = { x: 0, y: 0 };
                }
                root.index.all().forEach(element => {
                    if (isSelectable(element) && element.selected) {
                        element.selected = false;
                    }
                    if (isHoverable(element) && element.hoverFeedback) {
                        element.hoverFeedback = false;
                    }
                });

                return {
                    model: root,
                    modelChanged: true,
                    cause: this.action
                };
            }
        }
        return {
            model: context.root,
            modelChanged: false
        };
    }
}

// Necessary to have the correct layout in the hidden section.
@injectable()
export class MinimapExportSvgPostprocessor implements IVNodePostprocessor {
    root: GModelRoot;
    @inject(MinimapGLSPSvgExporter) protected svgExporter: MinimapGLSPSvgExporter;

    decorate(vnode: VNode, element: GModelElement): VNode {
        if (element instanceof GModelRoot) {
            this.root = element;
        }
        return vnode;
    }

    postUpdate(cause?: Action): void {
        if (this.root && RequestMinimapExportSvgAction.is(cause)) {
            this.svgExporter.export(this.root);
        }
    }
}
