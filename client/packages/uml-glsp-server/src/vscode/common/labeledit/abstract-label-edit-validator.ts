/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type GModelElement, type LabelEditValidator, ValidationStatus } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { type BaseDiagramModelState } from '../model/base-diagram-model-state.js';

type Ctor<T> = new (...args: any[]) => T;

@injectable()
export abstract class AbstractLabelEditValidator<TNode extends GModelElement> implements LabelEditValidator {
    abstract readonly modelState: BaseDiagramModelState;

    protected abstract getTargetNodeClass(): Ctor<TNode>;

    protected getNodeName(node: TNode): string {
        return (node as unknown as { name?: string }).name ?? '';
    }

    protected emptyNameMessage(): string {
        return 'Name must not be empty';
    }
    protected duplicateNameMessage(): string {
        return 'Name should be unique';
    }

    validate(label: string, element: GModelElement): ValidationStatus {
        if (!label || label.trim().length < 1) {
            return { severity: ValidationStatus.Severity.ERROR, message: this.emptyNameMessage() };
        }

        const NodeClass = this.getTargetNodeClass();

        const nodes = this.modelState.index.getAllByClass<TNode>(NodeClass);

        const hasDuplicate = nodes
            .filter(n => n.id !== element.id)
            .map(n => this.getNodeName(n))
            .some(name => name === label);

        if (hasDuplicate) {
            return { severity: ValidationStatus.Severity.WARNING, message: this.duplicateNameMessage() };
        }

        return { severity: ValidationStatus.Severity.OK };
    }
}
