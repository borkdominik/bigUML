/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type TemplateResult, html, svg } from 'lit';
import { property, state } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { BigElement } from '../base/component.js';
import '../global.js';
import { MinimapPaletteStyle as MinimapStyle } from './minimap.style';

export function defineMinimap(): void {
    customElements.define('big-minimap', Minimap);
}

export class Minimap extends BigElement {
    static override styles = [...super.styles, MinimapStyle.style];

    @property()
    clientId?: string; // necessary for the SetViewportAction otherwise it will be updated

    @property({ type: String })
    svg?: string;

    @property({ type: Object })
    modelBounds?: { width: number; height: number; x: number; y: number };

    @state()
    protected searchText?: string;

    @state()
    protected navigationIds: { [key: string]: { from: string; to: string }[] } = {};

    @state()
    viewPort?: { scroll: { x: number; y: number }; zoom: number };

    @state()
    canvasBounds?: { width: number; height: number; x: number; y: number };

    protected override render(): TemplateResult<1> {
        return html`${keyed(this.svg, html`<div>${this.headerTemplate()} ${this.bodyTemplate()}</div>`)}`;
    }

    protected headerTemplate(): TemplateResult<1> {
        return html`<header></header>`;
    }

    protected bodyTemplate(): TemplateResult<1> {
        const { x, y, width, height } = this.calculateRectangleValues();

        return html`
            <div class="body">
                <svg
                    class="svg"
                    id="mySVG"
                    viewBox="0 0 ${this.modelBounds?.width} ${this.modelBounds?.height}"
                    @mousedown="${this.startDrag}"
                >
                    ${unsafeSVG(this.svg)}
                    ${this.canvasBounds && this.modelBounds
                        ? svg` <rect
                                id="rect"
                                x="${x}"
                                y="${y}"
                                width="${width}"
                                height="${height}"
                                fill="none"
                                stroke="red"
                                stroke-width="5"
                                
                            ></rect>`
                        : ''}
                </svg>
            </div>
        `;
    }

    // move rectangle in minimap on drag
    // todo: still very laggy on diagramm side;
    // current workaround using throttle (reducing number of updates => rectangle moves looks not smooth, but lag is reduced)
    private isDragging = false;
    private animationFrameId: number | null = null;

    private startDrag(event: MouseEvent): void {
        event.preventDefault();
        this.isDragging = true;
        const svgMinimap = this.shadowRoot?.getElementById('mySVG') as SVGSVGElement | null;
        const rect = this.shadowRoot?.getElementById('rect') as SVGRectElement | null;
        if (svgMinimap && rect) {
            const onMouseMove = this.throttle((moveEvent: MouseEvent) => {
                if (this.isDragging) {
                    if (this.animationFrameId) {
                        cancelAnimationFrame(this.animationFrameId);
                    }
                    this.animationFrameId = requestAnimationFrame(() => {
                        // half width and height of rectangle in minimap
                        const halfWidth = (this.canvasBounds?.width ?? 0) / (this.viewPort?.zoom ?? 1) / 2;
                        const halfHeight = (this.canvasBounds?.height ?? 0) / (this.viewPort?.zoom ?? 1) / 2;

                        // cursor point
                        const point = svgMinimap.createSVGPoint();
                        point.x = moveEvent.clientX;
                        point.y = moveEvent.clientY;
                        const cursorPt = point.matrixTransform(svgMinimap.getScreenCTM()?.inverse());

                        // adjust x and y to upper left corner (for viewport)
                        const newX = cursorPt.x - halfWidth;
                        const newY = cursorPt.y - halfHeight;

                        // rectangle center does not move outside of minimap on drag
                        if (
                            newX > 0 - halfWidth &&
                            newY > 0 - halfHeight &&
                            newX < (this.modelBounds?.width ?? 0) - halfWidth &&
                            newY < (this.modelBounds?.height ?? 0) - halfHeight
                        ) {
                            this.updateViewport(cursorPt.x, cursorPt.y, newX, newY);
                        }
                    });
                }
            }, 100); // Throttle to 100ms (10 updates per second)
            // higher values reduce lag but make rectangle move not smooth

            const onMouseUp = () => {
                this.isDragging = false;
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            };

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        }
    }

    private throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
        let lastFunc: number;
        let lastRan: number;
        return function executedFunction(...args: any[]) {
            if (!lastRan) {
                func(...args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = window.setTimeout(() => {
                    if (Date.now() - lastRan >= limit) {
                        func(...args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        } as T;
    }

    public updateViewport(_x: number, _y: number, newX: number, newY: number): void {
        if (!this.modelBounds || !this.canvasBounds) {
            return;
        }
        const newViewport = {
            scroll: {
                x: newX + this.modelBounds.x,
                y: newY + this.modelBounds.y
            },
            zoom: this.viewPort?.zoom || 1
        };

        this.dispatchEvent(new CustomEvent('viewport-change', { detail: newViewport, bubbles: true, composed: true }));
    }

    // calculate the correct values for the rectangle in the minimap svg
    protected calculateRectangleValues(): { x: number; y: number; width: number; height: number } {
        /*
        Minimap rectangle values: x, y, width, height

        svg in viewbox: viewbox width are height are svg.modelBounds width, height means svg has 1:1 ratio with
        the modelBounds / original diagram
        x and y are 0 in the viewbox svg, corresbonding with x and y position in the svg.modelBounds (not 0)

        minmap svg top left corner has coordinates 0, 0; svg from original diagram doesn't need to "start" at 0 0,
        thats what modelBounds.x and modelBounds.y are for. To get the correct position of x and y in the rectangle
        in the minimap svg: subtract the x and y from the modelBounds from the x and y of the viewPort

        To get the correct width and height of the rectangle in the minimap svg: divide the width and height of the
        canvasBounds by the zoom level of the viewPort (1 by default). We use canvasBounds to get the correct width
        and height even if the window size changes

        to keep the rectangle within the minimap viewbox, we have to adjust the values of x, y, width and height
        boundaries if view is outside of box
            view is on left outside of svg:     if x < 0, x = 0, and width has to be adjusted
            view is on top outside of svg:      if y < 0, y = 0, and height has to be adjusted
            view is on right outside of svg:    width = modelBounds.width - x, width = modelBounds.width and width has to be adjusted to x
            view is on bottom outside of svg:   height = modelBounds.height - y, height = modelBounds.height, height has to be adjusted to y

            x,y,width and height are adjusted with value 3 or 5 to give a nice border at the edges
        */

        let x = this.viewPort?.scroll.x || 0;
        let y = this.viewPort?.scroll.y || 0;
        if (this.modelBounds) {
            // x and y are 0 or viewPort.x and viewPort.y
            x = x - this.modelBounds.x;
            y = y - this.modelBounds.y;
        }

        const zoom = this.viewPort?.zoom || 1;
        let width = this.canvasBounds?.width ? this.canvasBounds?.width / zoom : 0;
        let height = this.canvasBounds?.height ? this.canvasBounds?.height / zoom : 0;

        // boundaries if view is outside of box
        if (this.modelBounds && this.canvasBounds) {
            // left border
            if (x < 0) {
                // adjust width (if x is negative, width has to get smaler)
                // if right border is outside of the box, set width to 3 so the red border is visible
                if (x > 0 - this.canvasBounds.width / zoom) {
                    width = width + x; // + because x is negative and we want to subtract
                } else {
                    width = 2;
                }
                x = 2;
            }
            // top border
            if (y < 0) {
                // adjust height same as with x
                if (y > 0 - this.canvasBounds.height / zoom) {
                    height = height + y; // + because y is negative and we want to subtract
                } else {
                    height = 2;
                }
                y = 2;
            }

            // right border
            // width should not be bigger than modelBounds.width or else we don't see border in minimap
            // adjust width based on x
            if (width + x > this.modelBounds?.width) {
                if (x > this.modelBounds?.width - 2) {
                    x = this.modelBounds.width - 2;
                    width = 5;
                } else if (x > 2) {
                    width = this.modelBounds.width - x - 2;
                } else {
                    width = this.modelBounds.width - 4;
                }
            }

            // bottom border
            // height should not be bigger than modelBounds.height or else we don't see border in minimap
            // adjust height based on y
            if (height + y > this.modelBounds?.height) {
                if (y > this.modelBounds?.height - 2) {
                    y = this.modelBounds.height - 2;
                    height = 5;
                } else if (y > 2) {
                    height = this.modelBounds.height - y - 2;
                } else {
                    height = this.modelBounds.height - 4;
                }
            }
        }
        return { x, y, width, height };
    }
}
