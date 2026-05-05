hidden terminal WS: /\s+/;
hidden terminal NEW_LINE: /\n+/;
hidden terminal TAB: /\t+/;
terminal LANGIUM_BOOL returns boolean: /true|false/;
terminal LANGIUM_INT returns number: /(-)?[0-9]+(\.[0-9]*)?/;
// TODO: Haydar
terminal LANGIUM_ID: /[\w_\*-]+/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;