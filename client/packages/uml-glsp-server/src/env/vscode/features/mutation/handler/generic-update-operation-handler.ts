/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { isValidMultiplicity, storableName, storableProse, storableText, UpdateOperation } from '@borkdominik-biguml/uml-glsp-server';
import { isMultiplicityProperty } from '@borkdominik-biguml/uml-model-server/validation';
import { hasOptionalName } from '@borkdominik-biguml/uml-glsp-server/gen/vscode';
import { type Command, OperationHandler } from '@eclipse-glsp/server';
import type * as jsonpatch from 'fast-json-patch';
import { inject, injectable, multiInject, optional } from 'inversify';
import { ModelPatchCommand } from '../../command/model-patch-command.js';
import { type DiagramModelState } from '../../model/diagram-model-state.js';
import { firstClaim, MutationExtension } from '../extension/mutation-extension.js';
import { ModelPatchBuilder } from '../model-patch.js';

/**
 * A value that names another element rather than holding text arrives from the property palette with
 * this suffix on the element's id, and is stored as a reference to it.
 */
const REFERENCE_VALUE_SUFFIX = '_refValue';

/**
 * Writes one property of one element, as the property palette sends it.
 *
 * Generic in how a value is filtered down to what the grammar can hold and in how a cleared value is
 * stored. A property id that stands for something other than one property - the whole `trigger [guard]
 * / effect` line, or the turn of a shape - is taken over by a {@link MutationExtension}.
 */
@injectable()
export class GenericUpdateOperationHandler extends OperationHandler {
    override operationType = UpdateOperation.KIND;

    declare readonly modelState: DiagramModelState;

    @inject(ModelPatchBuilder)
    protected readonly patches: ModelPatchBuilder;

    @multiInject(MutationExtension)
    @optional()
    protected readonly extensions: MutationExtension[] = [];

    override createCommand(operation: UpdateOperation): Command | undefined {
        const patch = this.createPatch(operation);
        if (!patch || patch.length === 0) {
            return undefined;
        }
        return new ModelPatchCommand(this.modelState, JSON.stringify(patch));
    }

    protected createPatch(operation: UpdateOperation): jsonpatch.Operation[] | undefined {
        const element = this.modelState.index.findIdElement(operation.elementId);
        const elementPath = this.modelState.index.findPath(operation.elementId);

        const claimed = firstClaim(this.extensions, extension =>
            extension.updateProperty?.({ operation, element, elementPath, writeProperty: () => this.writeProperty(operation) })
        );
        if (claimed) {
            return claimed;
        }

        const written = this.writeProperty(operation);
        return written ? [written] : undefined;
    }

    protected writeProperty(operation: UpdateOperation): jsonpatch.Operation | undefined {
        const elementPath = this.modelState.index.findPath(operation.elementId);
        const element = this.modelState.index.findIdElement(operation.elementId);
        if (!elementPath || !element) {
            return undefined;
        }
        const current = (element as unknown as Record<string, unknown>)[operation.property];

        // What was typed, filtered down to what the grammar can hold. Nothing here fails loudly: a value
        // it cannot lex is written to the file and the file then never opens again. A value that filters
        // away to nothing is the same as an empty one, and an empty text field clears the property.
        if (typeof operation.value === 'string') {
            const typed = this.storableValue(operation.property, operation.value);
            if (typed === undefined) {
                // A `name` UML requires is the one thing that cannot be cleared: there is nothing an empty
                // one could be stored as, so the edit is dropped instead. Which names may go is what the
                // grammar writes as optional - generated from the definitions so the two cannot drift.
                if (operation.property === 'name' && !hasOptionalName(element.$type)) {
                    return undefined;
                }
                return this.patches.property(elementPath, operation.property, current, undefined);
            }
            // A multiplicity is held to what one is wherever it is written from (`@Language.multiplicity`):
            // one that is not whole is dropped rather than stored. It is stored as the text it is, too -
            // `1` read as a number would be written where the grammar reads a quoted value.
            if (isMultiplicityProperty(element.$type, operation.property)) {
                return isValidMultiplicity(typed) ? this.patches.property(elementPath, operation.property, current, typed) : undefined;
            }
            return this.patches.property(elementPath, operation.property, current, this.transformValue(typed));
        }

        return this.patches.property(elementPath, operation.property, current, operation.value);
    }

    protected transformValue(raw: string): unknown {
        if (raw.endsWith(REFERENCE_VALUE_SUFFIX)) {
            const target = this.modelState.index.findIdElement(raw.slice(0, -REFERENCE_VALUE_SUFFIX.length));
            return target ? { ref: { __id: target.__id, __documentUri: target.$document?.uri } } : raw;
        }
        return smartCast(raw);
    }

    /**
     * A typed value as the property can hold it, or nothing where none of it can be stored. A reference
     * is not text and is left alone - it arrives as an id to resolve, not as something to read. A name
     * is narrower than the rest, being parsed as an identifier rather than as free text; a `body` is
     * prose and keeps its punctuation, brackets included - every other text property is notation of
     * some fixed shape.
     */
    protected storableValue(property: string, value: string): string | undefined {
        if (value.endsWith(REFERENCE_VALUE_SUFFIX)) {
            return value;
        }
        // A role name (`sourceName`, `targetName`) is parsed as an identifier just as a name is.
        if (property === 'name' || property.endsWith('Name')) {
            return storableName(value);
        }
        if (property === 'body') {
            return storableProse(value);
        }
        return storableText(value);
    }
}

/** A string as the value it spells: `true`/`false` as booleans, a number as a number, anything else as it is. */
export function smartCast(value: unknown): unknown {
    if (typeof value !== 'string') {
        return value;
    }
    const trimmed = value.trim().toLowerCase();
    if (trimmed === 'true') {
        return true;
    }
    if (trimmed === 'false') {
        return false;
    }
    const asNumber = Number(trimmed);
    if (!Number.isNaN(asNumber) && trimmed !== '') {
        return asNumber;
    }
    return value;
}
