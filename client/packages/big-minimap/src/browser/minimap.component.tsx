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
import { debounce } from 'lodash';
import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactElement } from 'react';
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

function useWindowSize() {
    const element = useMemo(() => document.querySelector<HTMLElement>('body')!, []);

    const [size, setSize] = useState({ width: element.clientWidth, height: element.clientHeight });
    useLayoutEffect(() => {
        const updateSize = debounce(() => {
            setSize({ width: element.clientWidth, height: element.clientHeight });
        }, 100);

        window.addEventListener('resize', updateSize);
        return () => {
            window.removeEventListener('resize', updateSize);
            updateSize.cancel();
        };
    }, [element]);

    return size;
}

export function Minimap(): ReactElement {
    const { listenAction, dispatchAction } = useContext(VSCodeContext);
    const size = useWindowSize();

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
                setModelBounds(action.bounds);
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

    if (!viewPort || !modelBounds || !canvasBounds || !svg || modelBounds.height === 0 || modelBounds.width === 0) {
        return <></>;
    }

    const calculateRectangleValues = () => {
        let x = viewPort.scroll.x - modelBounds.x;
        let y = viewPort.scroll.y - modelBounds.y;

        const canvasWidth = canvasBounds.width / viewPort.zoom;
        const canvasHeight = canvasBounds.height / viewPort.zoom;
        const minimapHeight = size.height / scale;
        const minimapWidth = size.width / scale;

        let width = canvasWidth;
        let height = canvasHeight;

        if (x < 0) {
            width = canvasWidth + x;
            x = Math.max(x, 2);
        }
        if (x + width > minimapWidth) {
            width = minimapWidth - x;
        }
        if (x > minimapWidth) {
            x = minimapWidth;
        }

        if (y < 0) {
            height = canvasHeight + y;
            y = Math.max(y, 2)
        }
        if (y + height > minimapHeight) {
            height = minimapHeight - y;
        }
        if (y > minimapHeight) {
            y = minimapHeight;
        }


        return { x, y, width: Math.max(width, 2), height: Math.max(height, 2) };
    };

    const startDrag = (event: React.MouseEvent<SVGSVGElement>) => {
        event.preventDefault();
        isDraggingRef.current = true;

        const onMouseDown = (event: MouseEvent) => {
            if (!isDraggingRef.current || !svgRef.current || !rectRef.current) return;

            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);

            animationFrameId.current = requestAnimationFrame(() => {
                const newX = event.clientX / scale - canvasBounds.width / 2;
                const newY = event.clientY / scale - canvasBounds.height / 2;

                updateViewport(newX, newY);
            });
        };

        const onMouseUp = () => {
            isDraggingRef.current = false;
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
    };

    const updateViewport = (x: number, y: number) => {
        if (!elementId) return;

        const newViewport = {
            scroll: {
                x: x + modelBounds.x,
                y: y + modelBounds.y
            },
            zoom: 1
        };

        setViewPort(newViewport);
        dispatchAction(SetViewportAction.create(elementId, newViewport));
    };

    const scale = Math.min(size.width / modelBounds.width, size.height / modelBounds.height);
    const outline = calculateRectangleValues();

    return (
        <svg className='svg' ref={svgRef} id='mySVG' viewBox={`0 0 ${size.width} ${size.height}`} onMouseDown={startDrag}>
            <g transform={`scale(${scale})`}>
                <g dangerouslySetInnerHTML={{ __html: svg || '' }} />
                <rect
                    ref={rectRef}
                    id='rect'
                    x={outline.x}
                    y={outline.y}
                    width={outline.width}
                    height={outline.height}
                    fill='none'
                    stroke='red'
                    strokeWidth='5'
                />
            </g>
        </svg>
    );
}
