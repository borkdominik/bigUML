/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import {
  UmlServices,
  UmlSharedServices
} from './language-server/yo-generated/uml-module.js';

/**
 * Language services required in GLSP.
 */
export const BigUmlLSPServices = Symbol('BigUmlLSPServices');
export interface BigUmlLSPServices {
  /** Language services shared across all languages. */
  shared: UmlSharedServices;
  /** Uml language-specific services. */
  language: UmlServices;
}
