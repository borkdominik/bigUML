/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

/**
 * What a free-text property can hold, and what has to come out of a value before it is stored.
 *
 * The model grammar spells JSON structure out in keywords, so the characters that structure is made of -
 * `{`, `}`, `[`, `]`, `,`, `:`, `"` - have no terminal that could lex them inside a value. Storing one
 * does not fail loudly: the file is written, and the next read of it fails to parse. Anything else the
 * `LangiumText` alternatives do not cover goes the same way, which includes any letter outside ASCII.
 *
 * So this is a whitelist rather than a list of the offenders: exactly the characters
 * `LANGIUM_ID | LANGIUM_INT | LANGIUM_BOOL | LANGIUM_PUNCT | LANGIUM_SLASH` are made of (see
 * `terminals.langium`), and everything else is dropped. A whitelist is what keeps this honest as the
 * terminals change - a new offender is excluded by default rather than found the next time a file will
 * not open.
 */
const STORABLE_CHARACTER = /[\w *.+#()<>=?!|~^&%$@;'`/-]/;

/**
 * A value as it can be stored: without the characters the grammar has no terminal for, and `undefined`
 * where nothing is left of it - an empty string is no more storable than a brace, since `LangiumText`
 * matches one token or more. A property that cannot hold a value is removed rather than written empty.
 *
 * Notation is taken off by whoever put it on, which is usually the same call: the brackets around a
 * guard and the braces around a property string are both in here as characters that cannot be stored,
 * so stripping them and stripping the notation are one and the same thing.
 */
export function storableText(text: string): string | undefined {
    return keepOnly(text, STORABLE_CHARACTER);
}

/**
 * What a plain string property can hold, which is narrower still: a name is parsed as an identifier
 * (`LANGIUM_ID`), so it takes no punctuation at all - only word characters, `_`, `*`, `-`, and blanks
 * between words.
 *
 * This is what broke a diagram in the wild: `[ok]` typed onto a control flow's label was stored as its
 * name, the file was written, and it never opened again. A guard is where a bracketed condition belongs,
 * and there is now a label for it - but a name has to be safe whatever is typed into it.
 */
const STORABLE_NAME_CHARACTER = /[\w *-]/;

/** A name as it can be stored, or `undefined` where nothing storable is left of it. */
export function storableName(text: string): string | undefined {
    return keepOnly(text, STORABLE_NAME_CHARACTER);
}

function keepOnly(text: string, allowed: RegExp): string | undefined {
    return (
        [...text]
            .filter(character => allowed.test(character))
            .join('')
            .trim() || undefined
    );
}
