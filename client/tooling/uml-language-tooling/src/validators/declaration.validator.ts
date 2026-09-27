/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import chalk from 'chalk';
import { type Declaration, Decorator } from '../types/index.js';
import { isValueDeclaration, isValueType } from '../utils/declaration.js';

export function checkDeclarationValidity(declarations: Declaration[]): void {
    if (!declarations.find(declaration => Decorator.has(declaration.decorators, 'root'))) {
        throw new Error(chalk.red('Grammar has no entry element defined. Add @root decorator to your entry rule class'));
    }
    const rootElements = declarations.filter(declaration => Decorator.has(declaration.decorators, 'root'));
    if (rootElements.length > 1) {
        throw new Error(
            chalk.red('Grammar has too many root elements defined. Remove @root decorator from classes that are not the root element.')
        );
    }
    const rootElement = rootElements[0];
    if (!rootElement.properties || rootElement.properties.length === 0) {
        throw new Error(
            chalk.red('Grammar has no elements in root defined. Add properties to class with @root decorator to add elements.')
        );
    }
    const abstractErrors = declarations
        .filter(declaration => declaration.type !== 'type')
        .filter(ruleElement => ruleElement.isAbstract && (!ruleElement.extendedBy || ruleElement.extendedBy.length === 0))
        .map(errorRuleElement => errorRuleElement.name);
    if (abstractErrors && abstractErrors.length > 0) {
        throw new Error(
            chalk.red(
                `Can not create grammar rule for abstract declaration that is not extended by other declarations. [${abstractErrors.join(
                    ', '
                )}]`
            )
        );
    }
    const valueErrors = declarations.filter(isValueDeclaration).flatMap(declaration => {
        const errors: string[] = [];
        if (declaration.isAbstract || (declaration.extends ?? []).length > 0 || (declaration.extendedBy ?? []).length > 0) {
            errors.push(`${declaration.name} must be a concrete class outside any hierarchy`);
        }
        if (declaration.properties?.some(property => Decorator.has(property.decorators, 'reference'))) {
            errors.push(`${declaration.name} must not hold references`);
        }
        return errors;
    });
    const referencedValues = declarations
        .flatMap(declaration => declaration.properties ?? [])
        .filter(property => Decorator.has(property.decorators, 'reference'))
        .filter(property => property.types.some(type => isValueType(type.typeName, declarations)))
        .map(property => `${property.name} references a value object`);
    if (valueErrors.length > 0 || referencedValues.length > 0) {
        throw new Error(chalk.red(`Invalid @value declarations. [${[...valueErrors, ...referencedValues].join(', ')}]`));
    }
}
