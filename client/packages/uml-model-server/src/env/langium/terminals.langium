hidden terminal WS: /\s+/;
hidden terminal NEW_LINE: /\n+/;
hidden terminal TAB: /\t+/;
terminal LANGIUM_BOOL returns boolean: /true|false/;
// The fraction part requires at least one digit, otherwise `0..1` would be lexed as `0.` + `.1`.
terminal LANGIUM_INT returns number: /(-)?[0-9]+(\.[0-9]+)?/;
// A JSON string, escapes and all - every string value in the file: a name, free text, an id, a reference.
// It holds anything JSON can, and is read back with `JSON.parse` (see `UmlDiagramValueConverter`).
//
// The pattern here is what the grammar is checked against. The lexer matches with the one
// `UmlDiagramTokenBuilder` puts in its place, which leaves the quoted keywords of an enum value -
// `"visibility": "PUBLIC"` - to the keywords they are, so that the value keeps its type.
terminal STRING: /"(?:[^"\\\r\n]|\\.)*"/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;

// Rules for skipping unknown/unsupported JSON fields during parsing.
// Unknown fields are silently consumed so that files with extra properties
// (e.g. from a newer version) do not cause parse errors.
UnknownProperty: key=STRING ':' value=JsonValue;
JsonValue: stringValue=JsonStringValue | numValue=LANGIUM_INT | boolValue=LANGIUM_BOOL | nullValue?='null' | objectValue=JsonObject | arrayValue=JsonArray;
JsonStringValue: content=STRING;
JsonObject: '{' (pairs+=JsonObjectPair (',' pairs+=JsonObjectPair)*)? '}';
JsonObjectPair: key=STRING ':' value=JsonValue;
JsonArray: '[' (items+=JsonValue (',' items+=JsonValue)*)? ']';
