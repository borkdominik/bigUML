import {
    AstNode,
    DefaultLangiumDocumentFactory,
    LangiumDocument,
    streamAllContents,
  } from "langium";
  import { TextDocument } from "vscode-languageserver-textdocument";
  import { <%= LanguageName %>SharedServices } from "./<%= language-id %>-module.js";
  import { URI } from "vscode-uri";
  
  export class <%= LanguageName %>LangiumDocumentFactory extends DefaultLangiumDocumentFactory {
    constructor(services: <%= LanguageName %>SharedServices) {
      super(services);
    }
  
    override fromString<T extends AstNode = AstNode>(
      text: string,
      uri: URI
    ): LangiumDocument<T> {
      return super.fromString(text, uri);
    }
  
    override fromTextDocument<T extends AstNode = AstNode>(
      textDocument: TextDocument
    ): LangiumDocument<T> {
      var returnValue = super.fromTextDocument<T>(textDocument);
      let rootElement = returnValue.parseResult.value;
  
      streamAllContents(rootElement).forEach((astNode: any) => {
        if (astNode.id === undefined) {
          astNode.id = this.generateUniqueId();
        }
      });
      super.update(returnValue);
      return returnValue;
    }
  
    override fromModel<T extends AstNode = AstNode>(
      model: T,
      uri: URI
    ): LangiumDocument<T> {
      return super.fromModel(model, uri);
    }
  
    generateUniqueId(): string {
      const dateStr = Date.now().toString(36); // convert num to base 36 and stringify
      const randomStr = Math.random().toString(36).substring(2, 8); // start at index 2 to skip decimal point
      return `${dateStr}-${randomStr}`;
    }
  }
  