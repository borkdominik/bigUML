import {
    AstNode,
    ValidationAcceptor,
    ValidationChecks,
    streamAllContents,
  } from "langium";
  import { Model, UmlAstType } from "../generated/ast.js";
  import type { UmlServices } from "./uml-module.js";
  import { properties } from "../../../generator-config.js";
  
  /**
   * Register custom validation checks.
   */
  export function registerValidationChecks(services: UmlServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.UmlValidator;
    const checks: ValidationChecks<UmlAstType> = {
      Model: [validator.checkNoDuplicateIds],
    };
    registry.register(checks, validator);
  }
  
  /**
   * Implementation of custom validations.
   */
  export class UmlValidator {
    checkNoDuplicateIds(model: Model, accept: ValidationAcceptor): void {
      const reported = new Set();
      streamAllContents(model).forEach((astNode: AstNode & { __id?: string }) => {
        if (astNode[properties.referenceProperty]) {
          if (reported.has(astNode[properties.referenceProperty])) {
            accept("error", `Element has non-unique __id ${astNode[properties.referenceProperty]}.`, {
              node: astNode,
              property: "__id",
            });
          }
          reported.add(astNode[properties.referenceProperty]);
        }
      });
    }
  }
  