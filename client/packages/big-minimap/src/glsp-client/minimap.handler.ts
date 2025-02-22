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
    type CommandExecutionContext,
    type CommandResult,
    GLSPSvgExporter,
    type GModelElement,
    GModelRoot,
    HiddenCommand,
    type IVNodePostprocessor,
    TYPES,
    isExportable,
    isHoverable,
    isSelectable,
    isViewport
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { type VNode } from 'snabbdom';
import { v4 as uuid } from 'uuid';

// The following implementation follows the standard implementation
// https://github.com/eclipse-glsp/glsp-client/blob/master/packages/client/src/features/export/glsp-svg-exporter.ts

@injectable()
export class MinimapGLSPSvgExporter extends GLSPSvgExporter {
    override export(root: GModelRoot): void {
        if (typeof document !== 'undefined') {
            const svgElement = this.findSvgElement();
            if (svgElement) {
                // createSvg requires the svg to have a non-empty id, so we generate one if necessary
                const originalId = svgElement.id;
                try {
                    svgElement.id = originalId || uuid();
                    // provide generated svg code with respective sizing for proper viewing in browser and remove undesired border
                    const bounds = this.getBounds(root);
                    const svg = this.createSvg(svgElement, root).replace(
                        'style="',
                        `style="width: ${bounds.width}px !important;height: ${bounds.height}px !important;border: none !important;`
                    );
                    // do not give request/response id here as otherwise the action is treated as an unrequested response
                    this.actionDispatcher.dispatch(MinimapExportSvgAction.create(svg, root.id, bounds));
                } finally {
                    svgElement.id = originalId;
                }
            }
        }
    }
}

export class MinimapExportSvgCommand extends HiddenCommand {
    static readonly KIND = RequestMinimapExportSvgAction.KIND;

    constructor(@inject(TYPES.Action) protected action: RequestMinimapExportSvgAction) {
        super();
    }

    execute(context: CommandExecutionContext): CommandResult {
        console.log('MinimapExportSvgCommand.execute', context);
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

                console.warn('MinimapExportSvgCommand.root', root);
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
        console.log('MinimapExportSvgPostprocessor.postUpdate', cause);
        if (this.root) {
            // this.svgExporter.export(this.root);
        }
    }
}
