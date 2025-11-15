/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import fs from "fs";
import path from "path";
import { Project } from "ts-morph";
import { format } from "../util.js";

interface PropertyInfo {
  name: string;
  decoratorTexts: string[];
  typeText: string;
  isOptional: boolean;
}

interface EntityInfo {
  name: string; // AST type name, e.g. Class, Enumeration, …
  dtoClassName: string; // e.g. ClassValidationElement
  props: PropertyInfo[];
}

interface ValidationInfo {
  entities: EntityInfo[];
  decoratorImports: Array<{ from: string; names: string[] }>;
}

function collectDecoratorImports(defPath: string) {
  const proj = new Project({
    tsConfigFilePath: path.join(process.cwd(), "tsconfig.json"),
  });
  const src = proj.addSourceFileAtPath(defPath);

  const res: ValidationInfo["decoratorImports"] = [];

  src.getImportDeclarations().forEach((imp) => {
    const mod = imp.getModuleSpecifierValue();
    if (
      mod === "class-validator" ||
      mod.includes("/validation/custom-validators")
    ) {
      const names = imp.getNamedImports().map((n) => n.getName());
      if (names.length) res.push({ from: mod, names });
    }
  });

  return res;
}

function buildValidationInfo(defPath: string): ValidationInfo {
  const decoratorImports = collectDecoratorImports(defPath);
  const decoratorNames = new Set<string>(
    decoratorImports.flatMap((i) => i.names)
  );

  const proj = new Project({
    tsConfigFilePath: path.join(process.cwd(), "tsconfig.json"),
  });
  const src = proj.addSourceFileAtPath(defPath);

  const entities: EntityInfo[] = [];

  src.getClasses().forEach((cls) => {
    const props: PropertyInfo[] = [];
    const validateIfRefs = new Set<string>();

    cls.getProperties().forEach((prop) => {
      const decos = prop
        .getDecorators()
        .filter((d) => decoratorNames.has(d.getName()));
      if (decos.length) {
        const typeNode = prop.getTypeNode();
        props.push({
          name: prop.getName(),
          decoratorTexts: decos.map((d) => d.getText()),
          typeText: typeNode?.getText() ?? prop.getType().getText(),
          isOptional: prop.hasQuestionToken(),
        });

        // capture flags from ValidateIf lambdas
        decos
          .filter((d) => d.getName() === "ValidateIf")
          .forEach((d) => {
            const lamb = d.getArguments()[0]?.getText() ?? "";
            Array.from(lamb.matchAll(/o\.(\w+)/g)).forEach((m) =>
              validateIfRefs.add(m[1])
            );
          });
      }
    });

    // include referenced flags even without decorators
    validateIfRefs.forEach((n) => {
      if (!props.find((p) => p.name === n)) {
        const decl = cls.getProperty(n)!;
        const typeNode = decl.getTypeNode();
        props.push({
          name: n,
          decoratorTexts: [],
          typeText: typeNode?.getText() ?? decl.getType().getText(),
          isOptional: decl.hasQuestionToken(),
        });
      }
    });

    if (props.length) {
      entities.push({
        name: cls.getName()!,
        dtoClassName: `${cls.getName()}ValidationElement`,
        props,
      });
    }
  });

  return { entities, decoratorImports };
}

async function writeValidationElementsFile(
  extPath: string,
  defPath: string,
  info: ValidationInfo
) {
  const out = path.join(
    extPath,
    "yo-generated",
    "validation",
    "validation-elements.ts"
  );
  fs.mkdirSync(path.dirname(out), { recursive: true });

  const imports: string[] = [];

  // 1) Re-emit any decorator imports
  info.decoratorImports.forEach((i) => {
    const importPath = i.from.startsWith(".")
      ? path
          .relative(
            path.dirname(out),
            path.resolve(path.dirname(defPath), i.from)
          )
          .replace(/\\/g, "/")
      : i.from;
    imports.push(`import { ${i.names.join(", ")} } from '${importPath}';`);
  });

  // 2) Collect all AST types we actually use
  const astTypeNames = new Set<string>();
  // a) ctor source types
  info.entities.forEach((e) => astTypeNames.add(e.name));
  // b) every PascalCase identifier in prop.typeText
  info.entities.forEach((e) => {
    e.props.forEach((p) => {
      const ids = p.typeText.match(/\b[A-Z][A-Za-z0-9_]*\b/g) || [];
      ids.forEach((id) => {
        if (
          ![
            "Array",
            "Readonly",
            "Partial",
            "Record",
            "unknown",
            "any",
            "string",
            "number",
            "boolean",
          ].includes(id)
        ) {
          astTypeNames.add(id);
        }
      });
    });
  });

  // 3) Emit a single import for all AST types
  const astImportPath = path
    .relative(path.dirname(out), path.join(extPath, "generated", "ast.js"))
    .replace(/\\/g, "/");
  imports.push(
    `import { ${[...astTypeNames].sort().join(", ")} } from '${astImportPath}';`
  );

  // 4) Generate DTO classes without extra blank lines
  const classes = info.entities
    .map((ent) => {
      const body = ent.props
        .map((p) => {
          const decos = p.decoratorTexts.length
            ? "    " + p.decoratorTexts.join("\n    ") + "\n"
            : "";
          const optionalMark = p.isOptional ? "?" : "";
          return `${decos}    ${p.name}${optionalMark}: ${p.typeText};`;
        })
        .join("\n");

      return `
export class ${ent.dtoClassName} {
    constructor(src: ${ent.name}) { Object.assign(this, src); }

${body}
}
`;
    })
    .join("\n");

  const rawContent = `${imports.join("\n")}\n\n${classes}`;
  const formatted = await format(rawContent);

  fs.writeFileSync(out, formatted, "utf8");
  console.log("Generated validation-elements file:", out);
}

async function writeValidatorFile(extPath: string, info: ValidationInfo) {
  const out = path.join(extPath, "yo-generated", "validation/validator.ts");
  fs.mkdirSync(path.dirname(out), { recursive: true });

  const astGuards = info.entities.map((e) => `is${e.name}`).join(", ");
  const dtoNames = info.entities.map((e) => e.dtoClassName).join(", ");

  const cases = info.entities
    .map(
      (e) => `
    if (is${e.name}(node)) {
        errors = validateSync(new ${e.dtoClassName}(node));
    }`
    )
    .join("");

  const rawContent = `import { validateSync } from 'class-validator';
import type { AstNode } from 'langium';
import { ${astGuards} } from '../../generated/ast.js';
import { ${dtoNames} } from './validation-elements.js';

export function validateNode(node: AstNode): void {
    let errors = [];${cases}

    if (errors.length) {
        const msg = errors.flatMap(e => Object.values(e.constraints ?? {})).join(', ');
        throw new Error('Validation error: ' + msg);
    }
}
`;
  const formatted = await format(rawContent);
  fs.writeFileSync(out, formatted, "utf8");
  console.log("Generated validator file:", out);
}

export function generateValidationFiles(extensionPath: string) {
  const defPath = path.resolve(extensionPath, "definition", "def.ts");
  const info = buildValidationInfo(defPath);
  writeValidationElementsFile(extensionPath, defPath, info);
  writeValidatorFile(extensionPath, info);
}
