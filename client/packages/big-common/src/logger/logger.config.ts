/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { LogLevel } from './log-level.js';

/** Defined by `application/vscode/esbuild.ts`: `true` in production builds (the packaged VSIX). */
declare const __PRODUCTION__: boolean | undefined;

/** Unbundled code (tests, scripts) has no `__PRODUCTION__` and is treated as development. */
const isProduction = typeof __PRODUCTION__ !== 'undefined' && __PRODUCTION__;

export interface LoggerConfig {
    /** Level of loggers without a matching pattern in `loggers`. */
    defaultLevel: LogLevel;
    loggers: Record<string, LogLevel>;
    thirdParty: {
        glspServer: LogLevel;
        glspClient: LogLevel;
    };
}

/**
 * Global logger configuration. Loggers are matched by name using minimatch glob patterns.
 * Patterns are evaluated in order; the first match determines the log level.
 * Loggers without a matching pattern use `defaultLevel`.
 * Production builds only log warnings and errors; development builds log everything.
 *
 * @example
 * LOGGER_CONFIG.loggers = {
 *     'myPackage/**': LogLevel.Warn,
 *     '**\/debug': LogLevel.None,
 * };
 */
export const LOGGER_CONFIG: LoggerConfig = {
    defaultLevel: isProduction ? LogLevel.Warn : LogLevel.Info,
    loggers: {},
    thirdParty: {
        glspServer: isProduction ? LogLevel.Warn : LogLevel.Debug,
        glspClient: isProduction ? LogLevel.Warn : LogLevel.Debug
    }
};
