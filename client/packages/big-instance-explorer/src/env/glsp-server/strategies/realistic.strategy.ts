/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { en, Faker } from '@faker-js/faker';
import { type PropertyDescriptor, type ValueContext, type ValueStrategy } from './strategy.js';

/**
 * Realistic value strategy backed by Faker.js (topic feature 4c). Produces
 * human-readable, domain-plausible values by mapping a property's name to a Faker
 * generator (name, email, address, phone, price, ...), with a type-based fallback.
 *
 * Uses its own seeded {@link Faker} instance so output is reproducible and does not
 * touch Faker's global state. Returns `undefined` for reference-typed properties
 * (those become links).
 */
export class RealisticStrategy implements ValueStrategy {
    readonly kind = 'realistic';

    private readonly faker: Faker;

    constructor(seed = 0) {
        this.faker = new Faker({ locale: [en] });
        this.faker.seed(seed);
    }

    value(property: PropertyDescriptor, _ctx: ValueContext): string | undefined {
        const faker = this.faker;
        const name = property.name.toLowerCase();

        if (property.typeKind === 'reference') {
            return undefined;
        }
        if (property.typeKind === 'enumeration') {
            return property.enumLiterals && property.enumLiterals.length > 0
                ? faker.helpers.arrayElement(property.enumLiterals)
                : undefined;
        }
        if (property.typeKind === 'boolean') {
            return String(faker.datatype.boolean());
        }

        // Name-based heuristics (most specific first).
        if (name.includes('email') || name.includes('mail')) {
            return faker.internet.email();
        }
        if (name === 'firstname' || name === 'givenname') {
            return faker.person.firstName();
        }
        if (name === 'lastname' || name === 'surname' || name === 'familyname') {
            return faker.person.lastName();
        }
        if (name.includes('company')) {
            return faker.company.name();
        }
        if (name.includes('name')) {
            return faker.person.fullName();
        }
        if (name.includes('phone') || name.includes('tel')) {
            return faker.phone.number();
        }
        if (name.includes('department')) {
            return faker.commerce.department();
        }
        if (name.includes('city')) {
            return faker.location.city();
        }
        if (name.includes('country')) {
            return faker.location.country();
        }
        if (name.includes('zip') || name.includes('postal')) {
            return faker.location.zipCode();
        }
        if (name.includes('street') || name.includes('address')) {
            return faker.location.streetAddress();
        }
        if (name.includes('date')) {
            return faker.date.past().toISOString().slice(0, 10);
        }
        if (name.includes('year')) {
            // A realistic spread of years (e.g. birth/founding years). `faker.date.past()` defaults
            // to within ~1 year, which yields the same year for every instance and breaks isUnique.
            return String(faker.number.int({ min: 1950, max: new Date().getFullYear() }));
        }
        // Numeric semantics inferred from the name (helps untyped attributes look right).
        if (name.includes('salary') || name.includes('income') || name.includes('wage')) {
            return String(faker.number.int({ min: 30000, max: 200000 }));
        }
        if (
            name.includes('price') ||
            name.includes('amount') ||
            name.includes('budget') ||
            name.includes('cost') ||
            name.includes('total')
        ) {
            return String(faker.number.int({ min: 10, max: 100000 }));
        }
        if (name.includes('age')) {
            return String(faker.number.int({ min: 18, max: 80 }));
        }
        if (
            name.includes('size') ||
            name.includes('count') ||
            name.includes('quantity') ||
            name.includes('qty') ||
            name.includes('team') ||
            name.includes('number') ||
            name.includes('rank') ||
            name.includes('level') ||
            name.includes('score')
        ) {
            return String(faker.number.int({ min: 1, max: 100 }));
        }
        if (name.endsWith('id')) {
            return `${faker.string.alpha({ length: 3, casing: 'upper' })}${faker.number.int({ min: 100, max: 999 })}`;
        }

        // Type-based fallback.
        switch (property.typeKind) {
            case 'integer':
                return String(faker.number.int({ min: 0, max: 1000 }));
            case 'real':
                return String(faker.number.float({ min: 0, max: 1000, fractionDigits: 2 }));
            case 'string':
            case 'unknown':
            default:
                return faker.word.noun();
        }
    }
}
