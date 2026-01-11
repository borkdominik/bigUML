/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type Diagram, type UmlDiagramAstType } from '@borkdominik-biguml/model-server/grammar';
import { type AstNode, type ValidationAcceptor, type ValidationChecks, streamAllContents } from 'langium';
import { properties } from '../../generator-config.js';
import type { UmlDiagramServices } from './uml-diagram-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: UmlDiagramServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.UmlDiagramValidator;
    const checks: ValidationChecks<UmlDiagramAstType> = {
        Diagram: [validator.checkNoDuplicateIds]
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class UmlDiagramValidator {
    checkNoDuplicateIds(model: Diagram, accept: ValidationAcceptor): void {
        const reported = new Set();
        streamAllContents(model).forEach((astNode: AstNode & { __id?: string }) => {
            if (astNode[properties.referenceProperty as keyof AstNode] !== undefined) {
                if (reported.has(astNode[properties.referenceProperty as keyof AstNode])) {
                    accept('error', `Element has non-unique __id ${astNode[properties.referenceProperty as keyof AstNode]}.`, {
                        node: astNode,
                        property: '__id'
                    });
                }
                reported.add(astNode[properties.referenceProperty as keyof AstNode]);
            }
        });
    }
}
