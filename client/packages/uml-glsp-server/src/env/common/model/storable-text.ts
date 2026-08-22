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
 * What a note can hold, which is everything the grammar can lex: the characters above, plus the six
 * that JSON is structured with.
 *
 * Those six have no terminal and never can have - a terminal matching `[` would shadow the `[` that
 * opens every array in the file - but `LangiumText` takes them as keywords, which is a parser-level
 * decision and so applies only between the quotes of a value (see `terminals.langium`). That leaves
 * only `"`, which is what closes the value, and `\`, which would read as the start of an escape to
 * anything else that opens the file.
 *
 * Wider than {@link storableText} deliberately, and not instead of it. A guard is stored without the
 * brackets the notation writes it in and a multiplicity is a value in a fixed shape - for those, a
 * bracket arriving in the text is notation the user retyped, and dropping it is how it is taken back
 * off. A note has no notation to strip: it is prose, and a bracket in prose is a bracket.
 */
const STORABLE_PROSE_CHARACTER = /[\w *.+#()<>=?!|~^&%$@;'`/[\]{},:-]/;

/** A note's text as it can be stored, or `undefined` where nothing storable is left of it. */
export function storableProse(text: string): string | undefined {
    return keepOnly(text, STORABLE_PROSE_CHARACTER);
}

/**
 * What a plain string property can hold, which is narrower still: a name is parsed as `LangiumName`, so
 * it takes word characters, `_`, `*`, `-`, blanks between words, and the brackets and braces - and no
 * other punctuation. A `.` or a `(` in a name is notation, and notation has a property of its own to go
 * in; a bracket is not notation of any one thing, so `[ok]`, `{abstract}` and `List[T]` stay as typed.
 *
 * A name that could not be read back is what broke a diagram in the wild: `[ok]` typed onto a control
 * flow's label was stored as its name, the file was written, and it never opened again. The brackets are
 * in the grammar now (see `terminals.langium`), which is what makes them storable here - the whitelist
 * says what the grammar can read back, and nothing more.
 */
const STORABLE_NAME_CHARACTER = /[\w *[\]{}-]/;

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
