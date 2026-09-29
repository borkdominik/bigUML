/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { isValidMultiplicity, storableName, storableProse, storableText } from '@borkdominik-biguml/uml-glsp-server';
import { isMultiplicityProperty } from '@borkdominik-biguml/uml-model-server/validation';
import { hasNoName, hasOptionalName } from '@borkdominik-biguml/uml-glsp-server/gen/vscode';
import { ApplyLabelEditOperation, type Command, OperationHandler } from '@eclipse-glsp/server';
import type * as jsonpatch from 'fast-json-patch';
import { inject, injectable, multiInject, optional } from 'inversify';
import { type AstNode, isAstNode } from 'langium';
import { labelProperty } from '../../notation/label-ids.js';
import { ModelPatchCommand } from '../command/model-patch-command.js';
import { type DiagramModelState } from '../model/diagram-model-state.js';
import { firstClaim, MutationExtension } from '../mutation/extension/mutation-extension.js';
import { ModelPatchBuilder } from '../mutation/model-patch.js';

/**
 * Writes what was typed on a label back into the property the label stands for.
 *
 * Which property that is comes from the label's id (see `labelProperty`): `<id>_name_label` writes the
 * name, `<id>_guard_label` the guard, `<id>_body_label` a note's text. A label that stands for more than
 * one property - the `trigger [guard] / effect` line - is taken over by a {@link MutationExtension}.
 */
@injectable()
export class GenericLabelEditOperationHandler extends OperationHandler {
    override operationType = ApplyLabelEditOperation.KIND;

    declare readonly modelState: DiagramModelState;

    @inject(ModelPatchBuilder)
    protected readonly patches: ModelPatchBuilder;

    @multiInject(MutationExtension)
    @optional()
    protected readonly extensions: MutationExtension[] = [];

    override createCommand(operation: ApplyLabelEditOperation): Command | undefined {
        const patch = this.buildPatch(operation);
        if (patch.length === 0) {
            return undefined;
        }
        return new ModelPatchCommand(this.modelState, JSON.stringify(patch));
    }

    /**
     * The element a label belongs to. A label's id is that element's id with a suffix naming the label,
     * so the suffix is cut back a part at a time until what is left is an id the model knows, longest
     * first - ids are written `<type>_<uuid>` and may carry underscores of their own.
     */
    protected getSemanticIdFromLabelId(labelId: string): string {
        const parts = labelId.split('_');
        for (let count = parts.length; count > 0; count--) {
            const candidate = parts.slice(0, count).join('_');
            if (this.modelState.index.findSemanticElement(candidate, isAstNode)) {
                return candidate;
            }
        }
        return labelId;
    }

    protected buildPatch(operation: ApplyLabelEditOperation): jsonpatch.Operation[] {
        const semanticId = this.getSemanticIdFromLabelId(operation.labelId);
        const node = this.modelState.index.findSemanticElement(semanticId, isAstNode);
        const elementPath = this.modelState.index.findPath(semanticId);
        if (!node || !elementPath) {
            return [];
        }

        const property = labelProperty(operation.labelId, semanticId) ?? 'name';
        const edit = { labelId: operation.labelId, text: operation.text, node, semanticId, elementPath, property };
        const claimed = firstClaim(this.extensions, extension => extension.editLabel?.(edit));
        if (claimed) {
            return claimed;
        }

        // Filtered rather than written as typed: a bracket or a comma the grammar has no terminal for
        // is not stored badly - it is stored, the file is written, and the next read of it fails.
        const value = this.storableValue(property, operation.text);
        const current = (node as unknown as Record<string, unknown>)[property];

        // Refused here as well as while typing (see `UmlLabelEditValidator`): a multiplicity that is not a
        // whole one - `1.`, `5..2`, `abc` - is dropped rather than stored.
        if (value !== undefined && isMultiplicityProperty(node.$type, property) && !isValidMultiplicity(value)) {
            return [];
        }

        // The label an element is drawn as cannot be emptied: with nothing in it there is nothing on the
        // canvas to see the element by, and nothing left to click to start writing in again. The one
        // exception is a name the grammar writes as optional, which is cleared by removing it.
        if (value === undefined && property === this.primaryLabelProperty(node) && !(property === 'name' && hasOptionalName(node.$type))) {
            return [];
        }

        const patch = this.patches.property(elementPath, property, current, value);
        return patch ? [patch] : [];
    }

    /** The property an element is drawn as: its name, or - for an element that has none - its body. */
    protected primaryLabelProperty(node: AstNode): string {
        return hasNoName(node.$type) ? 'body' : 'name';
    }

    /**
     * A typed value as the property can hold it, or nothing where none of it can be stored. A name is
     * parsed as an identifier; a body is prose and keeps its punctuation; everything else is notation
     * that comes in wrapped in what the renderer put around it - the brackets of a guard, the braces of
     * a property string - which is taken off again here.
     */
    protected storableValue(property: string, value: string): string | undefined {
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
