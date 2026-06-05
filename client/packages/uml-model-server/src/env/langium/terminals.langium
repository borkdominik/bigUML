hidden terminal WS: /\s+/;
hidden terminal NEW_LINE: /\n+/;
hidden terminal TAB: /\t+/;
terminal LANGIUM_BOOL returns boolean: /true|false/;
terminal LANGIUM_INT returns number: /(-)?[0-9]+(\.[0-9]*)?/;
// TODO: Haydar
terminal LANGIUM_ID: /[\w_\*-]+/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;

// Rules for skipping unknown/unsupported JSON fields during parsing.
// Unknown fields are silently consumed so that files with extra properties
// (e.g. from a newer version) do not cause parse errors.
UnknownProperty: '"' key=LANGIUM_ID '"' ':' value=JsonValue;
JsonValue: stringValue=JsonStringValue | numValue=LANGIUM_INT | boolValue=LANGIUM_BOOL | nullValue?='null' | objectValue=JsonObject | arrayValue=JsonArray;
JsonStringValue: '"' content=LANGIUM_ID '"';
JsonObject: '{' (pairs+=JsonObjectPair (',' pairs+=JsonObjectPair)*)? '}';
JsonObjectPair: '"' key=LANGIUM_ID '"' ':' value=JsonValue;
JsonArray: '[' (items+=JsonValue (',' items+=JsonValue)*)? ']';