/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { AstNode, ValidationAcceptor, ValidationChecks, streamAllContents } from 'langium';
import { properties } from '../../../generator-config.js';
import { Diagram, UmlAstType } from '../generated/ast.js';
import type { UmlServices } from './uml-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: UmlServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = (services.validation as any).UmlValidator;
    const checks: ValidationChecks<UmlAstType> = {
        Diagram: [validator.checkNoDuplicateIds]
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class UmlValidator {
    checkNoDuplicateIds(model: Diagram, accept: ValidationAcceptor): void {
        const reported = new Set();
        streamAllContents(model).forEach((astNode: AstNode & { __id?: string }) => {
            if (astNode[properties.referenceProperty]) {
                if (reported.has(astNode[properties.referenceProperty])) {
                    accept('error', `Element has non-unique __id ${astNode[properties.referenceProperty]}.`, {
                        node: astNode,
                        property: '__id'
                    });
                }
                reported.add(astNode[properties.referenceProperty]);
            }
        });
    }
}
