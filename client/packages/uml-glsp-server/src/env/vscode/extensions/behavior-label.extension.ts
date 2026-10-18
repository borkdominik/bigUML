/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { isStatePart, isTransition } from '@borkdominik-biguml/uml-model-server/grammar';
import type * as jsonpatch from 'fast-json-patch';
import { injectable } from 'inversify';
import type { LabelEdit, MutationExtension, PropertyUpdate } from '../features/mutation/extension/mutation-extension.js';
import {
    BEHAVIOR_LABEL_PARTS,
    BEHAVIOR_LABEL_PROPERTY_ID,
    type BehaviorLabelPart,
    type BehaviorLabelParts,
    composeBehaviorLabel,
    parseBehaviorLabel
} from '../notation/behavior-label.js';

interface BehaviorLabelElement extends BehaviorLabelParts {
    name?: string;
}

interface BehaviorLabelPatchOptions {
    /**
     * Whether the element is drawn as its label and nothing else, in which case an empty line is refused
     * rather than written - a state's part would be left as a row of no height, which is neither
     * readable nor clickable. An element that is drawn as a shape of its own may go unlabelled.
     */
    required?: boolean;
    /**
     * Which parts the edited label stands for. All three by default. A part left out is still *written*
     * when the text carries one, so a guard typed in brackets lands where guards go wherever it was
     * typed. It is never *cleared* though: an edge writes its guard on a label of its own, and the
     * label beside it saying nothing about a guard is not the user saying there is no guard.
     */
    parts?: readonly BehaviorLabelPart[];
}

/**
 * The two elements labelled `trigger [guard] / effect` - a transition, and one line of a state's
 * second compartment. Their label is that notation rather than any one property, so editing it, on
 * the canvas or in the property palette, writes all three parts at once.
 */
@injectable()
export class BehaviorLabelExtension implements MutationExtension {
    updateProperty({ operation, element, elementPath }: PropertyUpdate): jsonpatch.Operation[] | undefined {
        if (operation.property !== BEHAVIOR_LABEL_PROPERTY_ID) {
            return undefined;
        }
        if (!element || !elementPath) {
            return [];
        }
        return behaviorLabelPatch(elementPath, element as BehaviorLabelElement, String(operation.value ?? ''), {
            required: isStatePart(element)
        });
    }

    editLabel({ node, property, elementPath, text }: LabelEdit): jsonpatch.Operation[] | undefined {
        if (property !== 'name' || !(isTransition(node) || isStatePart(node))) {
            return undefined;
        }
        // Both are drawn as one label standing for the whole notation, so an edit writes all three parts.
        return behaviorLabelPatch(elementPath, node as BehaviorLabelElement, text, { required: isStatePart(node) });
    }
}

/**
 * The operations that store `text`, written in the notation, onto the element - one per part, added
 * where the text carries it and removed where it does not and the element still holds one.
 */
function behaviorLabelPatch(
    elementPath: string,
    element: BehaviorLabelElement,
    text: string,
    options: BehaviorLabelPatchOptions = {}
): jsonpatch.Operation[] {
    const parts = parseBehaviorLabel(text);
    const stands = options.parts ?? BEHAVIOR_LABEL_PARTS;

    if (options.required && composeBehaviorLabel(parts) === undefined) {
        return [];
    }

    const patch: jsonpatch.Operation[] = [];
    for (const part of BEHAVIOR_LABEL_PARTS) {
        const path = `${elementPath}/${part}`;
        const value = parts[part];
        if (value !== undefined) {
            patch.push({ op: 'add', path, value });
        } else if (stands.includes(part) && element[part] !== undefined) {
            patch.push({ op: 'remove', path });
        }
    }

    // An element that carries none of the parts this label stands for is labelled with its name instead,
    // so that name is what the user just edited - keeping it would leave a second, now invisible label
    // behind, contradicting the one they typed.
    const stood = composeBehaviorLabel(Object.fromEntries(stands.map(part => [part, element[part]])));
    if (stood === undefined && element.name !== undefined) {
        patch.push({ op: 'remove', path: `${elementPath}/name` });
    }

    return patch;
}
