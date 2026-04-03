/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { type Args, DefaultTypes, type Dimension, type Point } from '@eclipse-glsp/protocol';
import { GCompartment, GEdge, type GEdgePlacement, GGraph, GLabel, GNode } from '@eclipse-glsp/server';
import * as uuid from 'uuid';
import type { GlspNode } from './jsx-namespace.js';
import { normalizeChildren, wireParent } from './utils.js';
// ============================================================================
// GCompartmentElement
// ============================================================================

export interface GCompartmentElementProps {
    id?: string;
    type?: string;
    layout?: string;
    layoutOptions?: Args;
    cssClasses?: string[];
    args?: Args;
    children?: GlspNode;
}

export function GCompartmentElement(props: GCompartmentElementProps): GCompartment {
    const comp = new GCompartment();
    comp.id = props.id ?? uuid.v4();
    comp.type = props.type ?? DefaultTypes.COMPARTMENT;
    comp.layout = props.layout;
    comp.layoutOptions = props.layoutOptions;
    comp.cssClasses = props.cssClasses ?? [];
    comp.args = props.args;
    comp.children = normalizeChildren(props.children);
    wireParent(comp);
    return comp;
}

// ============================================================================
// GLabelElement
// ============================================================================

export interface GLabelElementProps {
    id?: string;
    type?: string;
    text: string;
    cssClasses?: string[];
    args?: Args;
    alignment?: Point;
    edgePlacement?: GEdgePlacement;
}

export function GLabelElement(props: GLabelElementProps): GLabel {
    const label = new GLabel();
    label.id = props.id ?? uuid.v4();
    label.type = props.type ?? DefaultTypes.LABEL;
    label.text = props.text;
    label.cssClasses = props.cssClasses ?? [];
    label.args = props.args;
    if (props.alignment) {
        label.alignment = props.alignment;
    }
    label.edgePlacement = props.edgePlacement;
    label.children = [];
    return label;
}

// ============================================================================
// GNodeElement
// ============================================================================

export interface GNodeElementProps {
    id?: string;
    type?: string;
    layout?: string;
    layoutOptions?: Args;
    cssClasses?: string[];
    position?: Point;
    size?: Dimension;
    args?: Args;
    children?: GlspNode;
}

export function GNodeElement(props: GNodeElementProps): GNode {
    const node = new GNode();
    node.id = props.id ?? uuid.v4();
    node.type = props.type ?? DefaultTypes.NODE;
    node.layout = props.layout;
    node.layoutOptions = props.layoutOptions;
    node.cssClasses = props.cssClasses ?? [];
    if (props.position) {
        node.position = props.position;
    }
    if (props.size) {
        node.size = props.size;
    }
    node.args = props.args;
    node.children = normalizeChildren(props.children);
    wireParent(node);
    return node;
}

// ============================================================================
// GEdgeElement
// ============================================================================

export interface GEdgeElementProps {
    id?: string;
    type?: string;
    sourceId: string;
    targetId: string;
    routerKind?: string;
    cssClasses?: string[];
    args?: Args;
    children?: GlspNode;
}

export function GEdgeElement(props: GEdgeElementProps): GEdge {
    const edge = new GEdge();
    edge.id = props.id ?? uuid.v4();
    edge.type = props.type ?? DefaultTypes.EDGE;
    edge.sourceId = props.sourceId;
    edge.targetId = props.targetId;
    edge.routerKind = props.routerKind;
    edge.cssClasses = props.cssClasses ?? [];
    edge.args = props.args;
    edge.routingPoints = [];
    edge.children = normalizeChildren(props.children);
    wireParent(edge);
    return edge;
}

// ============================================================================
// GGraphElement
// ============================================================================

export interface GGraphElementProps {
    id: string;
    revision?: number;
    children?: GlspNode;
}

export function GGraphElement(props: GGraphElementProps): GGraph {
    const graph = new GGraph();
    graph.id = props.id;
    graph.type = DefaultTypes.GRAPH;
    graph.revision = props.revision;
    graph.cssClasses = [];
    graph.children = normalizeChildren(props.children);
    wireParent(graph);
    return graph;
}

// ============================================================================
// DividerElement - commonly used separator node
// ============================================================================

export interface DividerElementProps {
    id?: string;
    type?: string;
    text?: string;
    cssClasses?: string[];
}

export function DividerElement(props: DividerElementProps): GNode {
    const node = new GNode();
    node.id = props.id ?? uuid.v4();
    node.type = props.type ?? 'divider';
    node.layout = 'hbox';
    node.layoutOptions = { hGrab: true };
    node.cssClasses = props.cssClasses ?? [];
    node.children = [];
    if (props.text) {
        const label = new GLabel();
        label.id = uuid.v4();
        label.type = DefaultTypes.LABEL;
        label.text = props.text;
        label.cssClasses = ['uml-divider-subtitle'];
        label.children = [];
        label.parent = node;
        node.children.push(label);
    }
    return node;
}
