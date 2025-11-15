/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

import {
  DiagramSerializer,
  Serializer,
} from "@borkdominik-biguml/model-service";
import {
  <%= EntryElementName %>,
} from "./generated/ast.js";
import { <%= LanguageName %>Services } from "./<%= language-id %>-module.js";

/**
 * Hand-written AST serializer as there is currently no out-of-the box serializer from Langium, but it is on the roadmap.
 * cf. https://github.com/langium/langium/discussions/683
 * cf. https://github.com/langium/langium/discussions/863
 */
export class <%= LanguageName %>Serializer
  implements Serializer<<%= EntryElementName %>>, DiagramSerializer<<%= EntryElementName %>>
{
  constructor(protected services: <%= LanguageName %>Services) {}

  serialize(root: <%= EntryElementName %>): string {
    let str = "";
    return str;
  }

  public asDiagram(model: <%= EntryElementName %>): string {
    return "";
  }
}
