import {
    AstNode,
    ValidationAcceptor,
    ValidationChecks,
    streamAllContents,
  } from "langium";
  import { <%= EntryElementName %>, <%= LanguageName %>AstType } from "../generated/ast.js";
  import type { <%= LanguageName %>Services } from "./<%= language-id %>-module.js";
  import { properties } from "../../generator-config.js";
  
  /**
   * Register custom validation checks.
   */
  export function registerValidationChecks(services: <%= LanguageName %>Services) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.<%= LanguageName %>Validator;
    const checks: ValidationChecks<<%= LanguageName %>AstType> = {
      <%= EntryElementName %>: [validator.checkNoDuplicateIds],
    };
    registry.register(checks, validator);
  }
  
  /**
   * Implementation of custom validations.
   */
  export class <%= LanguageName %>Validator {
    checkNoDuplicateIds(model: <%= EntryElementName %>, accept: ValidationAcceptor): void {
      const reported = new Set();
      streamAllContents(model).forEach((astNode: AstNode & { <%= ReferenceProperty %>?: string }) => {
        if (astNode[properties.referenceProperty]) {
          if (reported.has(astNode[properties.referenceProperty])) {
            accept("error", `Element has non-unique <%= ReferenceProperty %> ${astNode[properties.referenceProperty]}.`, {
              node: astNode,
              property: "<%= ReferenceProperty %>",
            });
          }
          reported.add(astNode[properties.referenceProperty]);
        }
      });
    }
  }
  