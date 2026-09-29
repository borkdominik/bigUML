/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { getElementMetadata } from '@borkdominik-biguml/uml-glsp-server/gen/vscode';
import type { Dimension, Point } from '@eclipse-glsp/protocol';
import type { GModelElement } from '@eclipse-glsp/server';

/** What a renderer may ask about the layout stored for an element. */
export interface LayoutLookup {
    findPosition(elementId: string): Point | undefined;
    findSize(elementId: string): Dimension | undefined;
}

export interface ElementContext<T = unknown> {
    modelIndex: LayoutLookup;
    node: T;
    diagramType: string;
    elementType: string;
    /** Renders a child element the way the factory would, for a container that draws what it holds. */
    renderNode(child: unknown): GModelElement | undefined;
}

export interface BaseElementProps {
    type: string;
    position?: Point;
    size?: Dimension;
}

export interface BaseEdgeProps {
    type: string;
}

/**
 * The nodes a container holds, rendered the way the factory renders them on the canvas - or nothing,
 * where it holds none, so that no empty compartment is added for them.
 */
export function renderContents(ctx: ElementContext, children: readonly unknown[] | undefined): GModelElement[] | undefined {
    const rendered = (children ?? []).map(child => ctx.renderNode(child)).filter((element): element is GModelElement => !!element);
    return rendered.length > 0 ? rendered : undefined;
}

/**
 * Every node an element holds through its containment, rendered - or nothing, where it holds none. The
 * members an element draws as rows of its own (a property, an operation, a pin) are placed by it and not
 * among them, and neither is an edge, which the graph draws wherever it is kept.
 */
export function renderContainedNodes(ctx: ElementContext<{ $type: string }>, exclude: readonly string[] = []): GModelElement[] | undefined {
    const children = (getElementMetadata(ctx.node.$type)?.contains ?? [])
        .filter(({ property }) => !exclude.includes(property))
        .flatMap(({ property }) => ((ctx.node as unknown as Record<string, unknown>)[property] as unknown[] | undefined) ?? [])
        .filter(child => {
            const meta = getElementMetadata((child as { $type: string }).$type);
            return meta?.kind === 'node' && !meta.owned;
        });
    return renderContents(ctx, children);
}
