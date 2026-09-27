/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

/**
 * What a property marked `@Language.multiplicity` holds, and the one place that says so: the generated
 * validation, the label editing on the canvas and the property palette all check a multiplicity here.
 *
 * Kept free of any dependency, so that a browser bundle can use it without taking in the tooling.
 */

/** How a multiplicity is written, for the message a value that is not one is refused with. */
export const MULTIPLICITY_FORMAT_MESSAGE = 'A multiplicity is written `n`, `*`, `n..m` (with n <= m) or `n..*`.';

/**
 * Builds up a valid multiplicity as the user types: digits (`1`, `12`), a digit range (`1..5`),
 * a digit range open at the top (`1..*`), or a bare `*`. Anything else (extra dots, letters,
 * a `*` that isn't standalone or after `..`, anything typed after a `*`) is silently dropped.
 */
export function sanitizeMultiplicity(raw: string): string {
    let result = '';
    let dotCount = 0;

    for (const char of raw) {
        if (/\d/.test(char)) {
            // A single dot is only ever the first half of `..`, never a decimal point.
            if (dotCount !== 1) {
                result += char;
            }
        } else if (char === '.') {
            if ((dotCount === 0 && /\d$/.test(result)) || (dotCount === 1 && result.endsWith('.'))) {
                result += char;
                dotCount++;
            }
        } else if (char === '*') {
            if (result === '' || result.endsWith('..')) {
                result += char;
                break;
            }
        }
    }

    return result;
}

/** Whether a multiplicity is complete: `n`, `*`, `n..m` with `n <= m`, or `n..*`. */
export function isValidMultiplicity(value: string): boolean {
    const match = /^(?:\*|(\d+)|(\d+)\.\.(\d+|\*))$/.exec(value);
    if (!match) {
        return false;
    }
    const [, , lower, upper] = match;
    return lower === undefined || upper === '*' || Number(lower) <= Number(upper);
}

/** Whether a value may be stored as a multiplicity: a whole one, or none at all - an unset one is allowed. */
export function isStorableMultiplicity(value: unknown): boolean {
    return value === undefined || value === null || value === '' || (typeof value === 'string' && isValidMultiplicity(value));
}
