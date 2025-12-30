/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import {
  type Declaration,
  type Definition,
  type EntryRule,
  type LangiumDeclaration,
  type LangiumGrammar,
  Multiplicity,
  type TypeRule,
} from "./types/index.js";

export function transformDeclaration(
  declarations: Array<Declaration>
): Array<LangiumDeclaration> {
  declarations.forEach((decl) => {
    if (decl.properties) {
      decl.properties.forEach((prop) => {
        console.log(
          `DEBUG: Declaration "${decl.name}" property "${prop.name}" decorators:`,
          prop.decorators
        );
      });
    }
  });

  // map all declarations to langium declarations
  // if a declaration extends another declaration, add the properties of the extended declaration to the extending declaration
  const langiumDeclarations: Array<LangiumDeclaration> = declarations.map(
    (declaration) => {
      if (declaration?.extends!.length > 0) {
        declaration.extends!.forEach((extend) => {
          declaration.properties = declaration.properties!.concat(
            declarations.find((d) => d.name === extend)?.properties || []
          );
        });
      }
      return {
        type: declaration.type,
        name: declaration.name,
        isAbstract: declaration.isAbstract,
        decorators: declaration.decorators,
        properties: declaration.properties,
        extends: declaration.extends,
        extendedBy: [],
      };
    }
  );
  // add the extendedBy property to the langium declarations
  // this is necessary to know which declarations extend which other declarations
  declarations.forEach((declaration) => {
    if (declaration.extends!.length > 0) {
      declaration.extends!.forEach((extend) => {
        langiumDeclarations
          .find((langiumDeclaration) => langiumDeclaration.name === extend)!.extendedBy!.push(declaration.name!);
      });
    }
  });
  // if a declaration is abstract, remove all properties
  langiumDeclarations.forEach((langiumDeclaration) => {
    if (langiumDeclaration.isAbstract && langiumDeclaration.type === "class") {
      console.log("DEBUG LANGIUM: " + langiumDeclaration);
      langiumDeclaration.properties = [];
    }
  });

  return langiumDeclarations;
}

export function transformLangiumDeclarationToEntryRule(
  langiumDeclaration: LangiumDeclaration
): EntryRule {
  return {
    name: langiumDeclaration.name!,
    definitions: langiumDeclaration.properties!.map((property) => ({
      name: property.name,
      types: property.types,
      multiplicity: property.multiplicity,
      crossReference: property.decorators.includes("crossReference"),
      optional: property.isOptional,
    })),
  };
}

function getTypeName(type: any) {
  return type.typeName;
}
function getSortedTypeNames(definitions: any) {
  return definitions.map(getTypeName).sort().join(",");
}
function typeRuleExists(typeRules: Array<TypeRule>, propertyTypes: any) {
  const propertyTypesStr = propertyTypes.map(getTypeName).sort().join(",");
  return Array.from(typeRules).some(
    (typeRule) => getSortedTypeNames(typeRule.definitions) === propertyTypesStr
  );
}

export function transformLangiumDeclarationsToTypeRules(
  langiumDeclarations: Array<LangiumDeclaration>
): Array<TypeRule> {
  const typeRules = langiumDeclarations
    .filter((declaration) => declaration.type === "type")
    .map((declaration) => ({
      name: declaration.name,
      definitions:
        declaration.properties!.map((property) => property.types)?.flat() ?? [],
    }))
    .concat(
      langiumDeclarations
        .filter(
          (declaration) =>
            declaration.isAbstract && declaration.type === "class"
        )
        .map((declaration) => ({
          name: declaration.name,
          definitions: declaration.extendedBy!.map((extendedBy) => ({
            typeName: extendedBy,
            type: "simple",
          })),
        }))
    );
  const typeRules3: any = [];
  let unionId = 0;
  langiumDeclarations
    .filter(
      (declaration) => declaration.type === "class" && !declaration.isAbstract
    )
    .forEach((declaration) => {
      declaration.properties!.forEach((property) => {
        if (property.types.length > 1) {
          if (
            !typeRuleExists(typeRules as any, property.types) &&
            !typeRuleExists(typeRules3, property.types)
          ) {
            typeRules3.push({
              name: `UnionType_${unionId++}`,
              definitions: property.types.map((type) => ({
                typeName: type.typeName,
                type: type.type,
              })),
            });
            property.types = [
              { typeName: `UnionType_${unionId - 1}`, type: "simple" },
            ];
          }
        }
      });
    });
  return [...typeRules, ...typeRules3];
}

export function transformLangiumDeclarationsToLangiumGrammar(
  langiumDeclarations: Array<LangiumDeclaration>,
  generatorConfig: any
): LangiumGrammar {
  const entryRule = transformLangiumDeclarationToEntryRule(
    langiumDeclarations.find((langiumDeclaration) =>
      langiumDeclaration.decorators!.includes("root")
    )!
  );
  const typeRules =
    transformLangiumDeclarationsToTypeRules(langiumDeclarations);
  const parserRules = langiumDeclarations
    .filter(
      (langiumDeclaration) =>
        langiumDeclaration.type === "class" &&
        !langiumDeclaration.isAbstract &&
        !langiumDeclaration.decorators!.includes("root")
    )
    .map((langiumDeclaration) => {
      const properties: Array<Definition> = langiumDeclaration.properties!.map(
        (property) => ({
          name: property.name,
          type: property.types[0],
          multiplicity: property.multiplicity,
          crossReference: property.decorators.includes("crossReference"),
          optional: property.isOptional,
        })
      );
      if (
        !properties.find(
          (property) => property.name === generatorConfig.referenceProperty
        )
      ) {
        properties.unshift({
          name: generatorConfig.referenceProperty,
          type: { typeName: "string", type: "simple" },
          multiplicity: Multiplicity.ONE_TO_ONE,
          crossReference: false,
          optional: false,
        });
      }
      return {
        name: langiumDeclaration.name,
        isAbstract: langiumDeclaration.isAbstract,
        extendedBy: langiumDeclaration.extendedBy,
        definitions: properties,
        extra: langiumDeclaration.extra,
      };
    });
  entryRule.definitions.forEach((definition) => {
    if (definition.types!.length > 1) {
      const unionType = typeRules.find(
        (typeRule) =>
          typeRule.definitions
            .map((type) => type.typeName)
            .sort()
            .join(",") ===
          definition.types!
            .map((type) => type.typeName)
            .sort()
            .join(",")
      );
      if (unionType) {
        definition.type = { typeName: unionType.name, type: "simple" };
      }
    } else {
      definition.type = definition.types![0];
    }
  });

  return { entryRule, typeRules, parserRules: parserRules as any };
}
