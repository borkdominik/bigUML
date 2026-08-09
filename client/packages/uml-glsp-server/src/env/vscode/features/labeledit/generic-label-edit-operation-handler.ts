/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { isInitialState, isTransition, type Transition } from '@borkdominik-biguml/uml-model-server/grammar';
import { ApplyLabelEditOperation, type Command, OperationHandler } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { isAstNode } from 'langium';
import {
    composeTransitionLabel,
    parseTransitionLabel,
    TRANSITION_LABEL_PARTS
} from '../../elements/core/transition-label.js';
import { ModelPatchCommand } from '../command/model-patch-command.js';
import { type DiagramModelState } from '../model/diagram-model-state.js';

type LabelPatch = { op: 'add'; path: string; value: string } | { op: 'remove'; path: string };

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
        if (isTransition(node)) {
            return JSON.stringify(this.buildTransitionLabelPatch(node, semanticId, operation.text));
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

        return JSON.stringify([
            {
                op: 'replace' as const,
                path,
                value: operation.text
            }
        ]);
    }

    /**
     * A transition's label is its `trigger [guard] / effect` notation rather than one property, so
     * editing it writes all three parts at once. A part the user left out is removed rather than
     * stored as an empty string, which the grammar has no way to write.
     */
    protected buildTransitionLabelPatch(node: Transition, semanticId: string, text: string): LabelPatch[] {
        const parts = parseTransitionLabel(text);
        const base = this.modelState.index.findPath(semanticId);

        const patch: LabelPatch[] = [];
        for (const part of TRANSITION_LABEL_PARTS) {
            const path = `${base}/${part}`;
            const value = parts[part];
            if (value !== undefined) {
                patch.push({ op: 'add', path, value });
            } else if (node[part] !== undefined) {
                patch.push({ op: 'remove', path });
            }
        }

        // A transition that carries none of the three parts is labelled with its name instead, so
        // that name is what the user just edited - keeping it would leave a second, now invisible
        // label behind, contradicting the one they typed.
        if (composeTransitionLabel(node) === undefined && node.name !== undefined) {
            patch.push({ op: 'remove', path: `${base}/name` });
        }

        return patch;
    }
}
