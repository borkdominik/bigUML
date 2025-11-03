/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type EcoreAttribute, type EcoreDefinition } from "./ecore-types.js";

export function transformEcoreToTsDefinition(
  definition: EcoreDefinition
): string {
  const tsDefinition = [
    'import { root, crossReference, CrossReference, ABSTRACT_ELEMENT, ROOT_ELEMENT } from "generator-langium-model-management";',
  ];
  definition.types.forEach((type) => {
    tsDefinition.push(`type ${type.name} = ${type.types.join(" | ")}`);
  });
  tsDefinition.push(
    definition.dataTypes.map((type) => `type ${type} = string;`).join("\n")
  );
  tsDefinition.push(
    ...definition.classes
      .sort(
        (classA, classB) =>
          (classA.extends?.length ?? 0) - (classB.extends?.length ?? 0)
      )
      .map((eClass) => {
        if (eClass.isInterface) {
          const extenders = eClass.extends ?? [];
          if (eClass.isAbstract) {
            extenders.push("ABSTRACT_ELEMENT");
          }
          if (eClass.isRoot) {
            extenders.push("ROOT_ELEMENT");
          }

          return `interface ${eClass.name} ${
            extenders.length > 0 ? "extends " + extenders.join(", ") : ""
          } {
            ${eClass.attributes
              .map(
                (attr) =>
                  `${attr.name}${
                    attr.multiplicity === "?" || attr.multiplicity === "*"
                      ? "?"
                      : ""
                  }: ${getTsType(attr, true)}`
              )
              .join("\n")}
            }`;
        } else {
          return `${eClass.isRoot ? "@root" : ""} ${
            eClass.isAbstract ? "abstract" : ""
          } class ${eClass.name} ${
            eClass.extends?.length > 0
              ? "extends " + eClass.extends.join(", ")
              : ""
          } {
            ${eClass.attributes
              .map(
                (attr) =>
                  `${attr.reference ? "@crossReference" : ""} ${attr.name}${
                    attr.multiplicity === "?" || attr.multiplicity === "*"
                      ? "?"
                      : ""
                  }: ${getTsType(attr)}`
              )
              .join("\n")}
            }`;
        }
      })
  );
  return tsDefinition.join("\n");
}

function getTsType(attribute: EcoreAttribute, isInterface: boolean = false) {
  let type = attribute.type;
  if (attribute.multiplicity === "*" || attribute.multiplicity === "+") {
    type = "Array<" + type + ">";
  }
  if (attribute.reference && isInterface) {
    type = `CrossReference<${type}>`;
  }
  return type;
}
