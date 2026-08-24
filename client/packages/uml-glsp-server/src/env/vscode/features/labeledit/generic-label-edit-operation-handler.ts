/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import {
    behaviorLabelPatch,
    storableGuard,
    storableName,
    storableProse,
    type BehaviorLabelElement
} from '@borkdominik-biguml/uml-glsp-server';
import { isInitialState, isNote, isStatePart, isTextLabel, isTransition } from '@borkdominik-biguml/uml-model-server/grammar';
import { ApplyLabelEditOperation, type Command, OperationHandler } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { type AstNode, isAstNode } from 'langium';

type LabelPatch = { op: 'add'; path: string; value: string } | { op: 'remove'; path: string };

/** What the label beside a transition's guard stands for: the rest of `trigger [guard] / effect`. */
const TRANSITION_LABEL_PARTS = ['trigger', 'effect'] as const;
import { EDGE_GUARD_LABEL_SUFFIX, EDGE_MODIFIERS_LABEL_SUFFIX, storableModifiers } from '../../elements/core/edge-label.js';
import { ModelPatchCommand } from '../command/model-patch-command.js';
import { type DiagramModelState } from '../model/diagram-model-state.js';

@injectable()
export class GenericLabelEditOperationHandler extends OperationHandler {
    override operationType = ApplyLabelEditOperation.KIND;

    declare readonly modelState: DiagramModelState;

    override createCommand(operation: ApplyLabelEditOperation): Command {
        const patch = this.buildPatch(operation);
        return new ModelPatchCommand(this.modelState, patch);
    }

    /**
     * The element a label belongs to. A label's id is that element's id with a suffix naming the label -
     * `<id>_name_label` - so the suffix is cut back a part at a time until what is left is an id the
     * model knows, longest first.
     *
     * Cutting at the first `_` instead took the element id itself apart: ids are written `<type>_<uuid>`
     * (see `createRandomUUID`), so every label resolved to the bare type name, which is no element at
     * all - and `buildPatch` then dropped every edit on the floor. Trimming rather than matching a fixed
     * suffix also keeps this working for ids that carry an underscore of their own.
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

    // override if some types use a different field

    protected getLabelPropertyName(_astNode: unknown): string {
        return 'name';
    }

    protected buildPatch(operation: ApplyLabelEditOperation): string {
        const semanticId = this.getSemanticIdFromLabelId(operation.labelId);
        const node = this.modelState.index.findSemanticElement(semanticId, isAstNode);
        if (!node) {
            return JSON.stringify([]);
        }
        // Labels that stand for a property of their own rather than for the element's name: the guard an
        // edge writes in brackets, and the property string either end of an association writes in braces.
        // Every other label on an edge is the name, which is what the rest of this method writes, so they
        // are told apart by what the label's id ends in.
        if (operation.labelId.endsWith(EDGE_GUARD_LABEL_SUFFIX)) {
            return JSON.stringify(this.buildGuardPatch(node, semanticId, operation.text));
        }
        if (operation.labelId.endsWith(EDGE_MODIFIERS_LABEL_SUFFIX)) {
            // Which end it belongs to is in the id as well: `<id>_source_modifiers_label`.
            const end = operation.labelId.endsWith(`_target${EDGE_MODIFIERS_LABEL_SUFFIX}`) ? 'target' : 'source';
            return JSON.stringify(this.buildPropertyPatch(node, semanticId, `${end}Modifiers`, storableModifiers(operation.text)));
        }

        // A note and a free label are the text they hold and have no name at all, so the one label each
        // carries stands for its `body`. Emptying it is refused rather than written through: either with
        // nothing in it is nothing on the canvas to see it by, and - since both are written by typing on
        // that label - nothing left to click to start writing in again.
        if (isNote(node) || isTextLabel(node)) {
            // `storableProse` rather than `storableText`: neither has notation to take back off, so a
            // bracket typed into one is a bracket and is kept - see the filter for what still cannot be.
            const body = storableProse(operation.text);
            return JSON.stringify(body === undefined ? [] : this.buildPropertyPatch(node, semanticId, 'body', body));
        }

        // The two elements labelled `trigger [guard] / effect` - a transition, and one line of a
        // state's second compartment. Their label is that notation rather than any one property, so
        // editing it writes all three parts at once.
        if (isTransition(node) || isStatePart(node)) {
            const basePath = this.modelState.index.findPath(semanticId);
            return JSON.stringify(
                basePath
                    ? behaviorLabelPatch(basePath, node as BehaviorLabelElement, operation.text, {
                          required: isStatePart(node),
                          // A transition writes its guard on a label of its own, so this one stands for the
                          // other two: it may still set a guard typed in brackets, but it never clears the
                          // one the guard label holds. One line of a state's compartment has no second label
                          // and stands for the whole notation.
                          parts: isTransition(node) ? TRANSITION_LABEL_PARTS : undefined
                      })
                    : []
            );
        }

        const prop = this.getLabelPropertyName(node);
        const path = this.modelState.index.findPath(semanticId) + '/' + prop;

        if (prop === 'name' && operation.text.trim().length === 0) {
            // InitialState is anonymous in UML, so clearing its name removes the property
            // entirely rather than persisting an empty string, which the grammar can't re-parse.
            if (isInitialState(node) && node.name !== undefined) {
                return JSON.stringify([{ op: 'remove' as const, path }]);
            }
            return JSON.stringify([]);
        }

        // Filtered rather than written as typed. A name is parsed as an identifier, so a bracket, a comma
        // or an accented letter in one is not stored badly - it is stored, the file is written, and the
        // next read of it fails. `[ok]` typed onto a control flow is what found this.
        const value = prop === 'name' ? storableName(operation.text) : operation.text;
        if (value === undefined) {
            return JSON.stringify([]);
        }

        return JSON.stringify([
            {
                op: 'replace' as const,
                path,
                value
            }
        ]);
    }

    /**
     * Writes a guard typed on the line back onto the element, without the brackets it is written in -
     * which the user may well have retyped, and which cannot be stored in any case.
     *
     * Emptying it clears the guard rather than storing an empty string, which the grammar cannot
     * re-parse: `LangiumText` matches one token or more. A guard that was not set and was left empty is
     * no edit at all.
     */
    protected buildGuardPatch(node: AstNode, semanticId: string, text: string): LabelPatch[] {
        return this.buildPropertyPatch(node, semanticId, 'guard', storableGuard(text));
    }

    /**
     * Writes one property of an element from the label that stands for it, or clears it where the label
     * was emptied - a property the element does not carry and that was left empty is no edit at all.
     *
     * The value comes in already stripped of whatever the notation wraps it in, because that is what the
     * user retypes and what the grammar could not hold: it spells JSON structure out in keywords, and a
     * stored `[` or `{` leaves the model unparseable. An empty string is no more storable, which is why
     * clearing removes the property rather than writing one - `LangiumText` matches one token or more.
     */
    protected buildPropertyPatch(node: AstNode, semanticId: string, property: string, value: string | undefined): LabelPatch[] {
        const basePath = this.modelState.index.findPath(semanticId);
        if (!basePath) {
            return [];
        }

        const path = `${basePath}/${property}`;
        if (value !== undefined) {
            return [{ op: 'add', path, value }];
        }
        return (node as unknown as Record<string, unknown>)[property] !== undefined ? [{ op: 'remove', path }] : [];
    }
}
