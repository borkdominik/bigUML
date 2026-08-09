hidden terminal WS: /\s+/;
hidden terminal NEW_LINE: /\n+/;
hidden terminal TAB: /\t+/;
terminal LANGIUM_BOOL returns boolean: /true|false/;
// The fraction part requires at least one digit, otherwise `0..1` would be lexed as `0.` + `.1`.
terminal LANGIUM_INT returns number: /(-)?[0-9]+(\.[0-9]+)?/;
// TODO: Haydar
// Words may be separated by blanks so that names such as `publication date` are legal. Blanks are
// only allowed *between* words: a run of blanks that is not followed by another word is left to the
// hidden whitespace terminals, which keeps names free of leading and trailing blanks.
terminal LANGIUM_ID: /[\w_\*-]+( +[\w_\*-]+)*/;
// Punctuation runs that are not JSON structure. Only used by `LangiumText`, but it has to
// be a terminal so that characters such as `.` can be lexed at all. `/` is deliberately
// excluded so that it does not shadow the comment terminals below.
terminal LANGIUM_PUNCT: /[.+#()<>=?!|~^&%$@;'`]+/;
// A lone `/`, as in a transition's `trigger / effect` or a derived property's `/name`. Only the
// runs that start a comment are held back, so the terminals below keep matching exactly what
// they did before - a `/` that is not the start of one was never theirs to lex.
terminal LANGIUM_SLASH: /\/(?![/*])/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;

// Permissive value rule for free-form string properties (`@Language.text` in the def files),
// such as a UML multiplicity (`1`, `*`, `0..*`). A single terminal cannot do this job:
// terminals are matched without parser context, so a value like `"1"` would always be lexed
// as LANGIUM_INT and never as LANGIUM_ID. A data type rule is resolved by the parser instead
// and returns the concatenation of the matched tokens.
LangiumText returns string: (LANGIUM_ID | LANGIUM_INT | LANGIUM_BOOL | LANGIUM_PUNCT | LANGIUM_SLASH)+;

// Rules for skipping unknown/unsupported JSON fields during parsing.
// Unknown fields are silently consumed so that files with extra properties
// (e.g. from a newer version) do not cause parse errors.
UnknownProperty: '"' key=LANGIUM_ID '"' ':' value=JsonValue;
JsonValue: stringValue=JsonStringValue | numValue=LANGIUM_INT | boolValue=LANGIUM_BOOL | nullValue?='null' | objectValue=JsonObject | arrayValue=JsonArray;
JsonStringValue: '"' content=LangiumText '"';
JsonObject: '{' (pairs+=JsonObjectPair (',' pairs+=JsonObjectPair)*)? '}';
JsonObjectPair: '"' key=LANGIUM_ID '"' ':' value=JsonValue;
JsonArray: '[' (items+=JsonValue (',' items+=JsonValue)*)? ']';