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
//
// The last six alternatives are the characters JSON is structured with. They have no terminal of their
// own and never can have - this grammar spells JSON out in keywords, so a terminal matching `[` would
// shadow the `[` that opens every array in the file, and the lexer has no parser context to tell the
// two apart. As *keywords* they are already tokens, and taking them here is a parser-level decision
// rather than a lexer-level one: it applies only where a value is being read, and only between the
// quotes that delimit it. There is no ambiguity about where that value ends, because the one character
// not in this list is the `"` that closes it.
//
// `"` itself therefore cannot appear in a value, and neither can `\`, which would read as the start of
// an escape to anything else that opens the file. Everything else can - see `storableProse`.
LangiumText returns string: (LANGIUM_ID | LANGIUM_INT | LANGIUM_BOOL | LANGIUM_PUNCT | LANGIUM_SLASH | '[' | ']' | '{' | '}' | ',' | ':')+;

// What a name can hold, which is an identifier plus the brackets and the braces.
//
// A name is not prose - a `.` or a `(` in one is notation, and notation has a property of its own to go
// in - but a bracket is not notation of any one thing. `[ok]`, `{abstract}` and `List[T]` are all
// written into names, and the name is the only field there is to write them in. They are taken as
// keywords here for the same reason `LangiumText` takes them, and with the same bound: only between the
// quotes of a value, where the `"` that closes it is the one character not in the list.
//
// The number and the boolean are in here because they are what a lexer without parser context makes of
// a name that reads as one: `1` lexes as `LANGIUM_INT` however it was written, so a name of `1` could
// not be read back at all while a name was one `LANGIUM_ID` - it was stored, since a digit is a word
// character, and the file then failed to open. As alternatives of a rule the parser resolves, both are
// simply part of the name.
LangiumName returns string: (LANGIUM_ID | LANGIUM_INT | LANGIUM_BOOL | '[' | ']' | '{' | '}')+;

// Rules for skipping unknown/unsupported JSON fields during parsing.
// Unknown fields are silently consumed so that files with extra properties
// (e.g. from a newer version) do not cause parse errors.
UnknownProperty: '"' key=LANGIUM_ID '"' ':' value=JsonValue;
JsonValue: stringValue=JsonStringValue | numValue=LANGIUM_INT | boolValue=LANGIUM_BOOL | nullValue?='null' | objectValue=JsonObject | arrayValue=JsonArray;
JsonStringValue: '"' content=LangiumText '"';
JsonObject: '{' (pairs+=JsonObjectPair (',' pairs+=JsonObjectPair)*)? '}';
JsonObjectPair: '"' key=LANGIUM_ID '"' ':' value=JsonValue;
JsonArray: '[' (items+=JsonValue (',' items+=JsonValue)*)? ']';