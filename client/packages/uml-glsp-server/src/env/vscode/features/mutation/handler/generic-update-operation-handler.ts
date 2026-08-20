/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import {
    BEHAVIOR_LABEL_PROPERTY_ID,
    storableName,
    storableText,
    behaviorLabelPatch,
    type BehaviorLabelElement,
    ORIENTATION_PROPERTY_ID,
    storedOrientationDefaultSize,
    turnableDefaultSize,
    UpdateOperation
} from '@borkdominik-biguml/uml-glsp-server';
import { hasOptionalName } from '@borkdominik-biguml/uml-glsp-server/gen/vscode';
import { isStatePart } from '@borkdominik-biguml/uml-model-server/grammar';
import { type Command, OperationHandler } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { URI } from 'vscode-uri';
import { ModelPatchCommand } from '../../command/model-patch-command.js';
import { type DiagramModelState } from '../../model/diagram-model-state.js';

type UpdatePatch = { op: 'add' | 'replace' | 'remove'; path: string; value?: unknown };

@injectable()
export class GenericUpdateOperationHandler extends OperationHandler {
    override operationType = UpdateOperation.KIND;

    declare modelState: DiagramModelState;

    override createCommand(op: UpdateOperation): Command | undefined {
        const patch = this.createPatch(op);
        if (!patch || patch.length === 0) {
            return undefined;
        }
        return new ModelPatchCommand(this.modelState, JSON.stringify(patch));
    }

    protected createPatch(operation: UpdateOperation): UpdatePatch[] | undefined {
        const element = this.modelState.index.findIdElement(operation.elementId);

        if (operation.property === BEHAVIOR_LABEL_PROPERTY_ID) {
            // The palette offers `trigger [guard] / effect` as the one line it is drawn as, so what
            // comes back is that line and not a property of anything - see `BEHAVIOR_LABEL_PROPERTY_ID`.
            // Taken apart into the three properties it is stored as, exactly as editing the label on the
            // canvas does.
            const basePath = element ? this.modelState.index.findPath(operation.elementId) : undefined;
            if (!basePath) {
                return undefined;
            }
            // A state's part is drawn as its line and nothing else, so an empty one is refused rather
            // than leaving a row of no height behind. A transition is a shape either way and may go
            // unlabelled, so clearing the field clears its label.
            const patch = behaviorLabelPatch(basePath, element as BehaviorLabelElement, String(operation.value ?? ''), {
                required: isStatePart(element)
            });
            return patch.length > 0 ? patch : undefined;
        }

        if (operation.property === ORIENTATION_PROPERTY_ID) {
            // Turning one of these is not a property of the element but a swap of its bounds - see
            // `ORIENTATION_PROPERTY_ID`, which the palette offers without any property to back it.
            const defaultSize = turnableDefaultSize(element);
            if (defaultSize) {
                return this.turnPatch(operation, defaultSize);
            }

            // And one that does store its orientation is turned by writing that property *and* swapping
            // its bounds, so the shape ends up lying the way its contents now run. Written first, because
            // the swap is what a reader of the patch would otherwise take for the whole of the change.
            const storedSize = storedOrientationDefaultSize(element);
            if (storedSize) {
                const written = this.createUpdatePatch(operation);
                return [...(written ? [written] : []), ...(this.turnPatch(operation, storedSize) ?? [])];
            }
        }

        const single = this.createUpdatePatch(operation);
        return single ? [single] : undefined;
    }

    /**
     * Swaps the shape's stored width and height. A shape that has never been given a size is written
     * one, since there is nothing stored yet to turn.
     */
    protected turnPatch(operation: UpdateOperation, defaultSize: { width: number; height: number }): UpdatePatch[] | undefined {
        const wantVertical = operation.value === 'VERTICAL';
        const stored = this.modelState.index.findSize(operation.elementId);
        const sizePath = this.modelState.index.findSizePath(operation.elementId);
        const hasStoredSize = !!sizePath && !!stored?.width && !!stored?.height;
        const size = hasStoredSize ? { width: stored!.width!, height: stored!.height! } : defaultSize;

        // A square has no long axis to turn, and a shape already lying the way it was asked to lie has
        // nothing to do either. Both would otherwise write the size back unchanged, which still costs
        // the user an undo step and a redraw.
        if (size.width === size.height || size.height > size.width === wantVertical) {
            return undefined;
        }

        if (!hasStoredSize) {
            return [this.createSizePatch(operation.elementId, size.height, size.width)];
        }
        return [
            { op: 'replace', path: `${sizePath}/width`, value: size.height },
            { op: 'replace', path: `${sizePath}/height`, value: size.width }
        ];
    }

    /** A fresh `Size` metaInfo, shaped the way `GenericChangeBoundsOperationHandler` writes them. */
    protected createSizePatch(elementId: string, width: number, height: number): UpdatePatch {
        return {
            op: 'add',
            path: '/metaInfos/-',
            value: {
                $type: 'Size',
                __id: `size_${elementId}`,
                element: { $ref: { __id: elementId, __documentUri: URI.parse(this.modelState.semanticUri).path } },
                width,
                height
            }
        };
    }

    protected createUpdatePatch(
        operation: UpdateOperation
    ): { op: 'add' | 'replace' | 'remove'; path: string; value?: unknown } | undefined {
        const basePath = this.modelState.index.findPath(operation.elementId);
        if (!basePath) {
            return undefined;
        }

        const element = this.modelState.index.findIdElement(operation.elementId);
        const path = `${basePath}/${operation.property}`;

        // What was typed, filtered down to what the grammar can hold. Nothing here fails loudly: a value
        // it cannot lex is written to the file and the file then never opens again - `[ok]` typed into a
        // name is what found that. A name is narrower than the rest, being parsed as an identifier rather
        // than as free text. A value that filters away to nothing is the same as an empty one, which is
        // what the branch below is for.
        const typed = typeof operation.value === 'string' ? this.storableValue(operation.property, operation.value) : undefined;

        if (typeof operation.value === 'string' && typed === undefined) {
            // Emptying a text field clears the property: it is removed rather than written as an empty
            // string, which the grammar cannot re-parse - `LangiumText` matches one token or more. This
            // is every text property, not only a name: a transition's `trigger` and a state's `entry`
            // are cleared the same way, and writing `""` into any of them leaves a model that no longer
            // loads. Only a text field can arrive empty - a choice always sends one of its values and a
            // checkbox a boolean - so nothing else is caught by this.
            //
            // A `name` UML requires is the one thing that cannot be cleared: there is nothing an empty
            // one could be stored as, so the edit is dropped instead. The names that may go is what the
            // grammar writes as optional - see `hasOptionalName`, generated from the definitions so the
            // two cannot drift. Read off the node rather than through a type: `findIdElement` answers
            // with the one thing every element has in common, and a name is exactly what only some of
            // them carry.
            if (!element || (operation.property === 'name' && !hasOptionalName(element.$type))) {
                return undefined;
            }
            // Nothing stored is already cleared, and a `remove` of a property the model does not carry
            // is a patch that cannot be applied.
            const stored = (element as unknown as Record<string, unknown>)[operation.property];
            return stored !== undefined ? { op: 'remove', path } : undefined;
        }

        const value = this.transformValue({ ...operation, value: typed ?? operation.value }, element);
        const opKind = this.chooseOp(element, operation.property, value);

        return {
            op: opKind,
            path,
            value
        };
    }

    protected transformValue(operation: UpdateOperation, _element: any): unknown {
        const raw = operation.value;
        if (typeof raw === 'string' && raw.endsWith('_refValue')) {
            // TODO: When does this happen?
            const refId = raw.slice(0, -'_refValue'.length);
            const target = this.modelState.index.findIdElement(refId);
            if (!target) return raw; // fallback: leave as-is
            return {
                ref: {
                    __id: target.__id,
                    __documentUri: target.$document?.uri
                }
            };
        }
        return smartCast(raw);
    }

    /**
     * A typed value as the property can hold it, or nothing where none of it can be stored. A reference is
     * not text and is left alone - it arrives as an id to resolve, not as something to read.
     */
    protected storableValue(property: string, value: string): string | undefined {
        if (value.endsWith('_refValue')) {
            return value;
        }
        return property === 'name' ? storableName(value) : storableText(value);
    }

    /** choose between 'add' and 'replace' (default: always 'replace'). */

    protected chooseOp(element: any, property: string, _value: unknown): 'add' | 'replace' {
        return element && element[property] ? 'replace' : 'add';
    }
}

export function smartCast(value: unknown): unknown {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim().toLowerCase();
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    const asNum = Number(trimmed);
    if (!Number.isNaN(asNum) && trimmed !== '') return asNum;
    return value;
}
