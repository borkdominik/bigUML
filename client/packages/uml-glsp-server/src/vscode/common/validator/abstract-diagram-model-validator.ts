/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { GCompartment, GLabel, type GModelElement, type GNode, type Marker, MarkerKind, type ModelValidator } from '@eclipse-glsp/server';
import { injectable } from 'inversify';

export type ValidationRule<TNode extends GNode> = (node: TNode) => Marker | Marker[] | undefined;

@injectable()
export abstract class AbstractDiagramModelValidator<TNode extends GNode> implements ModelValidator {
    protected abstract isTargetNode(element: GModelElement): element is TNode;

    protected getRules(): ValidationRule<TNode>[] {
        return [];
    }

    validate(elements: GModelElement[]): Marker[] {
        const markers: Marker[] = [];
        const rules = this.getRules();

        for (const el of elements) {
            if (!this.isTargetNode(el)) continue;

            for (const rule of rules) {
                const res = rule(el);
                if (Array.isArray(res)) markers.push(...res);
                else if (res) markers.push(res);
            }
        }
        return markers;
    }

    protected findPrimaryLabel(node: TNode): GLabel | undefined {
        const compartment = node.children.find(c => c instanceof GCompartment) as GCompartment | undefined;
        if (compartment) {
            const label = compartment.children.find(c => c instanceof GLabel) as GLabel | undefined;
            if (label) return label;
        }
        return node.children.find(c => c instanceof GLabel) as GLabel | undefined;
    }

    protected ruleNameStartsUppercase(opts?: { label?: string; description?: string; severity?: Marker['kind'] }): ValidationRule<TNode> {
        const labelText = opts?.label ?? 'Name should start with uppercase';
        const descriptionText = opts?.description ?? 'Names should start with uppercase letters';
        const severity = (opts?.severity ?? MarkerKind.WARNING) as Marker['kind'];

        return (node: TNode) => {
            const label = this.findPrimaryLabel(node);
            if (!label?.text) return undefined;

            const first = label.text.charAt(0);
            if (first === first.toLowerCase()) {
                return {
                    kind: severity,
                    elementId: node.id,
                    label: labelText,
                    description: descriptionText
                };
            }
            return undefined;
        };
    }
}
