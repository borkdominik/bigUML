/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

/**
 * Suggests a semantically fitting default pattern for a property, used to prefill
 * the per-property inputs in the pattern editor. The user can edit or clear each
 * one (empty = random fallback). Heuristic and best-effort; for richer realism the
 * dedicated `realistic` (Faker) strategy is available.
 *
 * Examples: `suggestPattern('User', 'name')` -> `User_{n}`,
 * `suggestPattern('User', 'email')` -> `user_{n}@example.com`.
 */
export function suggestPattern(classifierName: string, propertyName: string): string {
    const name = propertyName.toLowerCase();
    const classifierLower = classifierName.toLowerCase();
    const includes = (token: string): boolean => name.includes(token);

    if (includes('email') || includes('mail')) {
        return `${classifierLower}_{n}@example.com`;
    }
    if (name === 'firstname' || name === 'givenname') {
        return '{pick:Alice,Bob,Carol,Dave,Eve}';
    }
    if (name === 'lastname' || name === 'surname' || name === 'familyname') {
        return '{pick:Smith,Johnson,Brown,Garcia,Lee}';
    }
    if (includes('name')) {
        return `${classifierName}_{n}`;
    }
    if (includes('phone') || includes('tel')) {
        return '+1-555-{n}';
    }
    if (includes('city')) {
        return '{pick:Vienna,Graz,Linz,Berlin,Madrid}';
    }
    if (includes('country')) {
        return '{pick:Austria,Germany,Spain,France,Italy}';
    }
    if (includes('street') || includes('address')) {
        return '{pick:Main St,Oak Ave,Elm Rd} {n}';
    }
    if (includes('year')) {
        return '{pick:2020,2021,2022,2023,2024}';
    }
    if (includes('date')) {
        return '{pick:2024-01-15,2023-07-09,2022-11-30}';
    }
    if (includes('price') || includes('amount') || includes('salary') || includes('budget') || includes('cost')) {
        return '{pick:1000,2500,5000,7500,10000}';
    }
    if (name.endsWith('id')) {
        return `${classifierName.slice(0, 3).toUpperCase()}{n}`;
    }
    return `${propertyName}_{n}`;
}
