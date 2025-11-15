/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

import {
  DiagramSerializer,
  Serializer,
} from "@borkdominik-biguml/model-service";
import { Model, isModel, Element, isElement } from "../generated/ast.js";
import { UmlServices } from "./uml-module.js";
import { AstNode } from "langium";

export class UmlSerializer
  implements Serializer<Model>, DiagramSerializer<Model>
{
  constructor(protected services: UmlServices) {}

  serialize(root: AstNode): string {
    let str: Array<string> = [];
    if (isModel(root)) {
      str.push(
        '"elements": [\n' +
          root.elements
            .map((element) => "" + this.serializeElement(element))
            .join(",\n") +
          "\n]"
      );
    }
    str = str.filter((element) => !!element);
    const json = JSON.parse("{\n" + str.join(",\n") + "\n}");
    return JSON.stringify(json, undefined, "\t");
  }

  serializeElement(element: Element): string {
    let str: Array<string> = [];
    str.push('"__type": "Element"');
    if (element.__id !== undefined && element.__id !== null) {
      str.push('"__id": ' + '"' + element.__id + '"');
    }
    if (element.name !== undefined && element.name !== null) {
      str.push('"name": ' + '"' + element.name + '"');
    }
    return "{" + str.join(",\n") + "}";
  }

  serializeModel(element: Model): string {
    let str: Array<string> = [];
    if (element.elements !== undefined && element.elements !== null) {
      str.push(
        '"elements": [' +
          element.elements
            .map((property) => this.serializeElement(property))
            .join(",") +
          "]"
      );
    }
    return "{" + str.join(",\n") + "}";
  }

  public asDiagram(root: Model): string {
    return "";
  }
}
