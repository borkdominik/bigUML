/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { VSCodeContext } from '@borkdominik-biguml/big-components';
import { InitializeCanvasBoundsAction } from '@eclipse-glsp/client';
import { SetViewportAction } from '@eclipse-glsp/protocol';
import { throttle } from 'lodash';
import { useContext, useEffect, useRef, useState, type ReactElement } from 'react';
import { MinimapExportSvgAction } from '../common/index.js';

interface Bounds {
    width: number;
    height: number;
    x: number;
    y: number;
}

interface Viewport {
    scroll: { x: number; y: number };
    zoom: number;
}

export interface MinimapProps {
    modelBounds?: Bounds;
}

export function Minimap(): ReactElement {
    const { listenAction, dispatchAction } = useContext(VSCodeContext);

    const [viewPort, setViewPort] = useState<Viewport | undefined>({ scroll: { x: 0, y: 0 }, zoom: 1 });
    const [elementId, setElementId] = useState<string | undefined>(undefined);
    const [modelBounds, setModelBounds] = useState<Bounds | undefined>(undefined);
    const [canvasBounds, setCanvasBounds] = useState<Bounds | undefined>(undefined);
    const [svg, setSVG] = useState<string | undefined>(undefined);

    useEffect(() => {
        listenAction(action => {
            if (MinimapExportSvgAction.is(action)) {
                setElementId(action.elementId);
                setSVG(action.svg);
                setModelBounds(action.modelBounds);
            } else if (SetViewportAction.is(action)) {
                const { scroll, zoom } = action.newViewport;
                setViewPort({
                    scroll: {
                        x: scroll.x,
                        y: scroll.y
                    },
                    zoom: zoom
                });
            } else if (InitializeCanvasBoundsAction.KIND === action.kind) {
                setCanvasBounds((action as InitializeCanvasBoundsAction).newCanvasBounds);
            }
        });
    }, [listenAction]);

    const svgRef = useRef<SVGSVGElement | null>(null);
    const rectRef = useRef<SVGRectElement | null>(null);
    const isDraggingRef = useRef(false);
    const animationFrameId = useRef<number | null>(null);

    const calculateRectangleValues = () => {
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
        let x = viewPort?.scroll.x || 0;
        let y = viewPort?.scroll.y || 0;

        if (modelBounds) {
            // x and y are 0 or viewPort.x and viewPort.y
            x = x - modelBounds.x;
            y = y - modelBounds.y;
        }

        const zoom = viewPort?.zoom || 1;
        let width = canvasBounds?.width ? canvasBounds.width / zoom : 0;
        let height = canvasBounds?.height ? canvasBounds.height / zoom : 0;

        // boundaries if view is outside of box
        if (modelBounds && canvasBounds) {
            if (x < 0) {
                width = x > -canvasBounds.width / zoom ? width + x : 2;
                x = 2;
            }
            if (y < 0) {
                height = y > -canvasBounds.height / zoom ? height + y : 2;
                y = 2;
            }

            if (width + x > modelBounds.width) {
                width = x > modelBounds.width - 2 ? 5 : modelBounds.width - x - 2;
            }
            if (height + y > modelBounds.height) {
                height = y > modelBounds.height - 2 ? 5 : modelBounds.height - y - 2;
            }
        }

        return { x, y, width, height };
    };

    const startDrag = (event: React.MouseEvent<SVGSVGElement>) => {
        event.preventDefault();
        isDraggingRef.current = true;

        const onMouseMove = throttle((moveEvent: MouseEvent) => {
            if (!isDraggingRef.current || !svgRef.current || !rectRef.current) return;

            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);

            animationFrameId.current = requestAnimationFrame(() => {
                const halfWidth = (canvasBounds?.width ?? 0) / (viewPort?.zoom ?? 1) / 2;
                const halfHeight = (canvasBounds?.height ?? 0) / (viewPort?.zoom ?? 1) / 2;

                const point = svgRef.current!.createSVGPoint();
                point.x = moveEvent.clientX;
                point.y = moveEvent.clientY;
                const cursorPt = point.matrixTransform(svgRef.current!.getScreenCTM()?.inverse() || undefined);

                const newX = cursorPt.x - halfWidth;
                const newY = cursorPt.y - halfHeight;

                if (
                    newX > 0 - halfWidth &&
                    newY > 0 - halfHeight &&
                    newX < (modelBounds?.width ?? 0) - halfWidth &&
                    newY < (modelBounds?.height ?? 0) - halfHeight
                ) {
                    updateViewport(cursorPt.x, cursorPt.y, newX, newY);
                }
            });
        }, 300);

        const onMouseUp = () => {
            isDraggingRef.current = false;
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    const updateViewport = (_x: number, _y: number, newX: number, newY: number) => {
        if (!modelBounds || !canvasBounds || !elementId) return;

        const newViewport = {
            scroll: {
                x: newX + modelBounds.x,
                y: newY + modelBounds.y
            },
            zoom: viewPort?.zoom || 1
        };

        setViewPort(newViewport);
        dispatchAction(SetViewportAction.create(elementId, newViewport));
    };

    const { x, y, width, height } = calculateRectangleValues();

    return (
        <div>
            <header></header>
            <div className='body'>
                <svg
                    className='svg'
                    ref={svgRef}
                    id='mySVG'
                    viewBox={`0 0 ${modelBounds?.width} ${modelBounds?.height}`}
                    onMouseDown={startDrag}
                >
                    <g dangerouslySetInnerHTML={{ __html: svg || '' }} />
                    {canvasBounds && modelBounds && (
                        <rect ref={rectRef} id='rect' x={x} y={y} width={width} height={height} fill='none' stroke='red' strokeWidth='5' />
                    )}
                </svg>
            </div>
        </div>
    );
}
