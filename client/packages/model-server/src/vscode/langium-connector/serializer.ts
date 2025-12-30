/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/

import { AstNode } from "langium";

export interface Serializer<T extends AstNode> {
  /**
   * Serializes the given semantic model to a String representation that can be parsed into the semantic model again.
   *
   * @param model semantic model
   */
  serialize(model: T): string;
}

export interface DiagramSerializer<T extends AstNode> extends Serializer<T> {
  /**
   * Creates a serialization of the diagram model based on the given semantic model.
   *
   * @param model semantic model (does not have to be a diagram element)
   */
  asDiagram(model: T): string;
}
