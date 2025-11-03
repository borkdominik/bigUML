/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import prettier from "prettier";
import { transformEcoreToTsDefinition } from "./ecore-transformer.js";
import { type EcoreClass, type EcoreDefinition, type EcoreType } from "./ecore-types.js";

export async function parseEcoreDefinitionFile(_path: any): Promise<any> {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });

  const definitionFileContent = fs.readFileSync(_path, "utf8");
  const parsedXml = parser.parse(definitionFileContent);
  const ecoreDefinition = parseEcoreDefinition(parsedXml);
  const tsDefinition = transformEcoreToTsDefinition(ecoreDefinition);

  const formattedDefinitionFile = await prettier.format(tsDefinition, {
    parser: "typescript",
    trailingComma: "es5",
  });
  fs.writeFileSync(
    path.resolve(_path, "../", "./def.ts"),
    formattedDefinitionFile
  );
  return ecoreDefinition;
}

export function parseEcoreDefinition(parsedXml: any): EcoreDefinition {
  const definition: EcoreDefinition = {
    classes: [],
    types: [],
    dataTypes: [],
  };
  Object.keys(parsedXml).forEach((key) => {
    switch (key) {
      case "ecore:EPackage": {
        visitPackage(parsedXml[key], definition);
        const classNames = collectRootClasses(definition);
        const eRoot: EcoreClass = {
          name: mapRootName(parsedXml[key]["name"]),
          extends: [],
          attributes: definition.classes
            .filter((eClass) => classNames.includes(eClass.name))
            .map((eClass) => ({
              derived: false,
              name: eClass.name.toLowerCase(),
              changeable: true,
              containment: true,
              defaultValueLiteral: "",
              lowerBound: "0",
              multiplicity: "*",
              ordered: false,
              reference: false,
              transient: false,
              type: eClass.name,
              unique: false,
              unsettable: false,
              upperBound: "-1",
              volatile: false,
            })),
          isAbstract: false,
          isRoot: true,
          isInterface: false,
          instanceClassName: "",
          instanceTypeName: "",
        };
        definition.classes.push(eRoot);
        break;
    }}
  });
  return definition;
}

function collectRootClasses(definition: EcoreDefinition) {
  return definition.classes
    .filter((eClass) => {
      return !definition.classes.some((c) =>
        c.attributes.some(
          (attribute) => attribute.type === eClass.name && attribute.containment
        )
      );
    })
    .filter((eClass) => {
      return (
        eClass.extends.length === 0 ||
        !definition.classes.some((c) =>
          c.attributes.some((attribute) =>
            collectSuperClasses(definition, eClass)
              .map((sc) => sc.name)
              .includes(attribute.type)
          )
        )
      );
    })
    .filter((eClass) => !eClass.isAbstract)
    .map((eClass) => eClass.name);
}

function collectSuperClasses(definition: EcoreDefinition, eClass: EcoreClass) {
  const superClasses = definition.classes.filter((c) =>
    eClass.extends.includes(c.name)
  );
  superClasses.forEach((superClass) =>
    superClasses.concat(...collectSuperClasses(definition, superClass))
  );
  return superClasses;
}

function mapRootName(name?: string) {
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : "RootElement";
}

function visitPackage(node: any, definition: EcoreDefinition) {
  Object.keys(node).forEach((key) => {
    if (key === "eClassifiers") {
      const classifiers = Array.isArray(node[key]) ? node[key] : [node[key]];
      classifiers.forEach((classifier: any) => {
        switch (classifier["xsi:type"]) {
          case "ecore:EClass": {
            const eClass = {
              name: cleanName(classifier["name"]),
              extends: mapSuperTypes(
                classifier["eSuperTypes"]?.split(" ") ?? []
              ),
              attributes: [],
              isAbstract: isAbstract(classifier["abstract"]),
              isRoot: false,
              isInterface: isInterface(classifier["interface"]),
              instanceClassName: cleanName(classifier["instanceClassName"]),
              instanceTypeName: cleanName(classifier["instanceTypeName"]),
            };
            definition.classes.push(eClass);
            visitEClass(classifier, eClass);
            break;
          }
          case "ecore:EEnum": {
            const eType = {
              name: cleanName(classifier["name"]),
              types: [],
            };
            definition.types.push(eType);
            visitEEnum(classifier, eType);
            break;
          }
          case "ecore:EDataType": {
            const eDataType = cleanName(
              classifier["instanceTypeName"] ??
                classifier["instanceClassName"] ??
                classifier["name"]
            );
            definition.dataTypes.push(eDataType);
            break;
          }
        }
      });
    }
  });
}

function isAbstract(isAbstract: string) {
  return isAbstract === "true";
}
function isInterface(isInterface: string) {
  return isInterface === "true";
}

function visitEClass(node: any, eClass: EcoreClass) {
  Object.keys(node).forEach((key) => {
    switch (key) {
      case "eStructuralFeatures":
        if (Array.isArray(node[key])) {
          node[key].forEach((feature: any) => {
            visitStructuralFeatures(feature, eClass);
          });
        } else {
          visitStructuralFeatures(node[key], eClass);
        }
        break;
    }
  });
}

function visitEEnum(node: any, eType: EcoreType) {
  Object.keys(node).forEach((key) => {
    switch (key) {
      case "eLiterals":
        node[key].forEach((literal: any) => {
          eType.types.push(
            JSON.stringify(literal["literal"] ?? literal["name"])
          );
        });
        break;
    }
  });
}

function visitStructuralFeatures(node: any, eClass: EcoreClass) {
  switch (node["xsi:type"]) {
    case "ecore:EAttribute":
    case "ecore:EReference":
      eClass.attributes.push({
        changeable: node["changeable"],
        containment:
          node["xsi:type"] === "ecore:EAttribute"
            ? true
            : node["containment"] === "true",
        defaultValueLiteral: node["defaultValueLiteral"],
        derived: node["derived"],
        ID: node["iD"],
        lowerBound: node["lowerBound"],
        multiplicity: getMultiplicity(node["lowerBound"], node["upperBound"]),
        name: cleanName(node["name"]),
        ordered: node["ordered"],
        reference:
          node["xsi:type"] === "ecore:EAttribute"
            ? false
            : !node["containment"] || node["containment"] === "false",
        transient: node["transient"],
        type: mapType(node["eType"]),
        unique: node["unique"],
        unsettable: node["unsettable"],
        upperBound: node["upperBound"],
        volatile: node["volatile"],
      });
  }
}

function getMultiplicity(lowerBound: string = "0", upperBound: string = "1") {
  if (lowerBound === "0" && upperBound === "-1") {
    return "*";
  } else if (lowerBound === "1" && upperBound === "1") {
    return "1";
  } else if (
    (lowerBound === "1" && upperBound === "-1") ||
    (+lowerBound > 0 && +upperBound > 1)
  ) {
    return "+";
  } else {
    return "?";
  }
}

function mapType(_type: string) {
  const type = _type.split("/").slice(-1)[0];
  switch (type) {
    case "EFloatObject":
    case "EIntegerObject":
    case "EDoubleObject":
    case "ELongObject":
    case "EFloat":
    case "EInteger":
    case "EDouble":
    case "ELong":
      return "number";
    case "EString":
    case "EDate":
    case "EChar":
    case "ECharObject":
    case "EDateObject":
    case "EStringObject":
      return "string";
    case "EBoolean":
    case "EBooleanObject":
      return "boolean";
    default:
      return cleanName(type);
  }
}
function mapSuperTypes(superTypes: string[]) {
  return superTypes.map((type) => type.split("/").slice(-1)[0]);
}
function cleanName(name: string = "") {
  if (
    [
      "break",
      "case",
      "catch",
      "class",
      "const",
      "continue",
      "debugger",
      "default",
      "delete",
      "do",
      "else",
      "enum",
      "export",
      "extends",
      "false",
      "finally",
      "for",
      "function",
      "if",
      "import",
      "in",
      "instanceof",
      "new",
      "null",
      "return",
      "super",
      "switch",
      "this",
      "throw",
      "true",
      "try",
      "typeof",
      "var",
      "void",
      "while",
      "with",
    ].includes(name.toLowerCase())
  ) {
    return name + "_";
  }
  return name;
}
