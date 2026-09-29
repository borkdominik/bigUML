/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { getDefaultSize } from '@borkdominik-biguml/uml-glsp-server/gen/vscode';
import type { Dimension, Point } from '@eclipse-glsp/protocol';
import type * as jsonpatch from 'fast-json-patch';
import { inject, injectable } from 'inversify';
import { DiagramModelState } from '../model/diagram-model-state.js';

/** A size as an operation may carry it: either dimension may be unknown and is then kept as stored. */
export interface PartialSize {
    width?: number;
    height?: number;
}

/** Bounds as an operation may carry them: every field left out is kept as stored. */
export type PartialBounds = Partial<Point & Dimension>;

const BOUNDS_FIELDS = ['x', 'y', 'width', 'height'] as const;

/**
 * Builds the JSON patch operations that write an element: its layout - the `bounds` of a node, the
 * `routingPoints` of an edge - and any other property of it.
 *
 * Every mutation that touches layout goes through here, so there is one place that knows how layout is
 * shaped and that it is replaced field by field where it exists and added whole where it does not.
 */
@injectable()
export class ModelPatchBuilder {
    @inject(DiagramModelState)
    protected readonly modelState: DiagramModelState;

    /**
     * Writes the bounds of an element. Where it has some, only the fields given are replaced - a move
     * and a resize of one element may come as two writes, and neither must undo the other. Where it has
     * none, they are added whole, with what was not given taken from the element's default size.
     *
     * Coordinates are rounded to hundredths: a drag leaves long fractions behind, and a very small one
     * would be printed in exponent notation, which the grammar's number terminal cannot read back.
     */
    bounds(elementId: string, bounds: PartialBounds): jsonpatch.Operation[] {
        const path = this.modelState.index.findBoundsPath(elementId);
        if (path === undefined) {
            return [];
        }
        const stored = this.modelState.index.findBounds(elementId);
        const given = BOUNDS_FIELDS.filter(field => bounds[field] !== undefined).map(field => [field, roundCoordinate(bounds[field]!)] as const);

        if (stored) {
            return given
                .filter(([field, value]) => stored[field] !== value)
                .map(([field, value]) => ({ op: 'replace', path: `${path}/${field}`, value }));
        }
        const element = this.modelState.index.findIdElement(elementId);
        return [
            {
                op: 'add',
                path,
                value: { $type: 'Bounds', x: 0, y: 0, ...getDefaultSize(element?.$type ?? ''), ...Object.fromEntries(given) }
            }
        ];
    }

    /** Writes the size of an element, keeping its position. */
    size(elementId: string, size: PartialSize): jsonpatch.Operation[] {
        return this.bounds(elementId, { width: size.width, height: size.height });
    }

    /** Writes the position of an element, keeping its size. */
    position(elementId: string, position: Point): jsonpatch.Operation[] {
        return this.bounds(elementId, { x: position.x, y: position.y });
    }

    /**
     * Writes the bend points of an edge; an edge left with none has them removed. Nothing where that is
     * what is stored already. Rounded the way `bounds` are.
     */
    routingPoints(edgeId: string, points: Point[]): jsonpatch.Operation | undefined {
        const edgePath = this.modelState.index.findPath(edgeId);
        if (edgePath === undefined) {
            return undefined;
        }
        const path = `${edgePath}/routingPoints`;
        // Read back from a file, an edge without bend points holds an empty list rather than none.
        const stored = this.modelState.index.findRoutingPoints(edgeId) ?? [];
        const rounded = points.map(point => ({ $type: 'Point', x: roundCoordinate(point.x), y: roundCoordinate(point.y) }));

        if (samePoints(stored, rounded)) {
            return undefined;
        }
        if (rounded.length === 0) {
            return { op: 'remove', path };
        }
        return { op: 'add', path, value: rounded };
    }

    /**
     * Writes one property of an element, or clears it where `value` is `undefined`.
     *
     * Clearing removes the property rather than writing an empty value - the grammar cannot re-parse an
     * empty string, `LangiumText` matching one token or more - and a property the element does not carry
     * is already clear: a `remove` of it would be a patch that cannot be applied, so none is written.
     */
    property(elementPath: string, property: string, current: unknown, value: unknown): jsonpatch.Operation | undefined {
        const path = `${elementPath}/${property}`;
        if (value === undefined) {
            return current !== undefined ? { op: 'remove', path } : undefined;
        }
        return { op: current !== undefined ? 'replace' : 'add', path, value };
    }
}

function roundCoordinate(value: number): number {
    return Math.round(value * 100) / 100;
}

function samePoints(a: Point[], b: Point[]): boolean {
    return a.length === b.length && a.every((point, index) => point.x === b[index].x && point.y === b[index].y);
}

/**
 * One write per piece of layout. Where two parts of an operation place or size the same element, the
 * first to say so wins - as it did when layout was kept apart from the element - and a field written
 * after the bounds holding it were added is folded into that `add`, which is the one the patch keeps.
 */
export function coalesceLayoutPatches(operations: jsonpatch.Operation[]): jsonpatch.Operation[] {
    const seen = new Set<string>();
    const addedBounds = new Map<string, Record<string, unknown>>();
    return operations.filter(operation => {
        if (!isLayoutPath(operation.path)) {
            return true;
        }
        if (seen.has(operation.path)) {
            return false;
        }
        seen.add(operation.path);

        const parent = operation.path.slice(0, operation.path.lastIndexOf('/'));
        const added = addedBounds.get(parent);
        if (added && operation.op === 'replace') {
            added[operation.path.slice(parent.length + 1)] = operation.value;
            return false;
        }
        if (operation.op === 'add' && operation.path.endsWith('/bounds')) {
            addedBounds.set(operation.path, operation.value);
        }
        return true;
    });
}

function isLayoutPath(path: string): boolean {
    return /\/bounds(\/(x|y|width|height))?$/.test(path) || path.endsWith('/routingPoints');
}
