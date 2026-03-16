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
    type ActionDispatcher,
    Bounds,
    type CommandExecutionContext,
    type CommandResult,
    EditorContextService,
    type ExportSvgOptions,
    type GModelElement,
    GModelRoot,
    HiddenCommand,
    type ILogger,
    type IVNodePostprocessor,
    TYPES,
    type ViewerOptions,
    isBoundsAware,
    isExportable,
    isHoverable,
    isSelectable,
    isViewport
} from '@eclipse-glsp/client';
import { inject, injectable, multiInject, optional } from 'inversify';
import { type VNode } from 'snabbdom';
import { type ISvgExportPostProcessor } from 'sprotty/lib/features/export/svg-export-postprocessor.js';
import { v4 as uuid } from 'uuid';

// The following implementation follows the standard implementation
// https://github.com/eclipse-glsp/glsp-client/blob/master/packages/client/src/features/export/glsp-svg-exporter.ts

@injectable()
export class MinimapGLSPSvgExporter {
    @inject(TYPES.ViewerOptions) protected readonly options: ViewerOptions;
    @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: ActionDispatcher;
    @inject(TYPES.ILogger) protected readonly log: ILogger;
    @multiInject(TYPES.ISvgExportPostprocessor)
    @optional()
    protected readonly postprocessors: ISvgExportPostProcessor[] = [];

    @inject(EditorContextService)
    protected readonly editorContext: EditorContextService;

    export(root: GModelRoot, request?: RequestMinimapExportSvgAction): void {
        if (typeof document !== 'undefined') {
            let svgElement = this.findSvgElement();
            if (svgElement) {
                svgElement = this.prepareSvgElement(svgElement, root, request);
                const serializedSvg = this.createSvg(svgElement, root, request?.options ?? {}, request);
                const svgExport = this.getSvgExport(serializedSvg, svgElement, root, request);
                const bounds = this.getBounds(root, this.findSvgElement());
                // do not give request/response id here as otherwise the action is treated as an unrequested response
                this.actionDispatcher.dispatch(
                    MinimapExportSvgAction.create({
                        svg: svgExport,
                        elementId: root.id,
                        responseId: request?.requestId,
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

    protected createSvg(svgElement: SVGSVGElement, root: GModelRoot, options?: ExportSvgOptions, cause?: Action): string {
        // createSvg requires the svg to have a non-empty id, so we generate one if necessary
        const originalId = svgElement.id;
        try {
            svgElement.id = originalId || uuid();
            return this.doCreateSvg(svgElement, root, options, cause);
        } finally {
            svgElement.id = originalId;
        }
    }

    protected doCreateSvg(svgElementOrig: SVGSVGElement, root: GModelRoot, options?: ExportSvgOptions, cause?: Action): string {
        const serializer = new XMLSerializer();
        const svgCopy = serializer.serializeToString(svgElementOrig);
        const iframe: HTMLIFrameElement = document.createElement('iframe');
        document.body.appendChild(iframe);
        if (!iframe.contentWindow) throw new Error('IFrame has no contentWindow');
        const docCopy = iframe.contentWindow.document;
        docCopy.open();
        docCopy.write(svgCopy);
        docCopy.close();
        const svgElementNew = docCopy.querySelector('svg')!;
        svgElementNew.removeAttribute('opacity');
        if (!options?.skipCopyStyles) {
            // inline-size copied from sprotty-hidden svg shrinks the svg so it is not visible.
            this.copyStyles(svgElementOrig, svgElementNew, ['width', 'height', 'opacity', 'inline-size']);
        }
        svgElementNew.setAttribute('version', '1.1');
        const bounds = this.getBounds(root, docCopy.querySelector('svg'));

        svgElementNew.setAttribute('viewBox', `${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`);
        svgElementNew.setAttribute('width', `${bounds.width}`);
        svgElementNew.setAttribute('height', `${bounds.height}`);

        this.postprocessors.forEach(postprocessor => {
            postprocessor.postUpdate(svgElementNew, cause);
        });

        const svgCode = serializer.serializeToString(svgElementNew);
        document.body.removeChild(iframe);

        return svgCode;
    }

    protected findSvgElement(): SVGSVGElement | null {
        const div = document.getElementById(this.options.hiddenDiv);
        // search for first svg element as hierarchy within Sprotty might change
        return div && div.querySelector('svg');
    }

    protected prepareSvgElement(svgElement: SVGSVGElement, _root: GModelRoot, _request?: RequestMinimapExportSvgAction): SVGSVGElement {
        return svgElement;
    }

    protected copyStyles(source: Element, target: Element, skippedProperties: string[]): void {
        this.copyStyle(source, target, skippedProperties);

        // IE doesn't retrun anything on source.children
        for (let i = 0; i < source.childNodes.length; ++i) {
            const sourceChild = source.childNodes[i];
            const targetChild = target.childNodes[i];
            if (sourceChild instanceof Element) {
                this.copyStyles(sourceChild, targetChild as Element, []);
            }
        }
    }

    protected copyStyle(source: Element, target: Element, skippedProperties: string[]): void {
        const sourceStyle = getComputedStyle(source);
        const targetStyle = getComputedStyle(target);

        let style = '';
        for (let i = 0; i < sourceStyle.length; i++) {
            const propertyName = sourceStyle[i];
            if (!skippedProperties.includes(propertyName)) {
                const propertyValue = sourceStyle.getPropertyValue(propertyName);
                const propertyPriority = sourceStyle.getPropertyPriority(propertyName);
                if (targetStyle.getPropertyValue(propertyName) !== propertyValue) {
                    if (this.shouldUpdateStyle(target)) {
                        // rather set the property directly on the element to keep other values intact
                        target.style.setProperty(propertyName, propertyValue);
                    } else {
                        // collect all properties to set them at once
                        style += `${propertyName}: ${propertyValue}${propertyPriority ? ' !' + propertyPriority : ''}; `;
                    }
                }
            }
        }
        if (style !== '') {
            target.setAttribute('style', style.trim());
        }
    }

    protected shouldUpdateStyle(element: any): element is ElementCSSInlineStyle {
        // we want to simply update the style of elements and keep other values intact if they have a style property
        return 'tagName' in element && 'style' in element;
    }

    protected getSvgExport(
        serializedSvgElement: string,
        svgElement: SVGElement,
        root: GModelRoot,
        request?: RequestMinimapExportSvgAction
    ): string {
        const svgExportStyle = this.getSvgExportStyle(svgElement, root, request);
        return svgExportStyle ? serializedSvgElement.replace('style="', `style="${svgExportStyle}`) : serializedSvgElement;
    }

    protected getSvgExportStyle(_svgElement: SVGElement, root: GModelRoot, _request?: RequestMinimapExportSvgAction): string | undefined {
        // provide generated svg code with respective sizing for proper viewing in browser and remove undesired border
        const bounds = this.getBounds(root, document.querySelector('svg'));
        return (
            `width: ${bounds.width}px !important;` +
            `height: ${bounds.height}px !important;` +
            'border: none !important;' +
            'cursor: default !important;'
        );
    }

    protected getBounds(root: GModelRoot, svgElement: SVGGElement | null): Bounds {
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
            this.svgExporter.export(this.root, cause);
        }
    }
}
