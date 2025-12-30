/********************************************************************************
 * Copyright (c) 2023 CrossBreeze.
 ********************************************************************************/
import {
  <%= LanguageName %>Services,
  <%= LanguageName %>SharedServices,
} from "./language-server/yo-generated/<%= language-id %>-module.js";

/**
 * Language services required in GLSP.
 */
export const <%= LanguageName %>LSPServices = Symbol("<%= LanguageName %>LSPServices");
export interface <%= LanguageName %>LSPServices {
  /** Language services shared across all languages. */
  shared: <%= LanguageName %>SharedServices;
  /** <%= LanguageName %> language-specific services. */
  language: <%= LanguageName %>Services;
}
