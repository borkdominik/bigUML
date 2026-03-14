/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { LogLevel } from './log-level.js';

export interface LoggerConfig {
    loggers: Record<string, LogLevel>;
}

/**
 * Global logger configuration. Loggers are matched by name using minimatch glob patterns.
 * Patterns are evaluated in order; the first match determines the log level.
 * Loggers without a matching pattern default to LogLevel.Log.
 *
 * @example
 * LOGGER_CONFIG.loggers = {
 *     'myPackage/**': LogLevel.Warn,
 *     '**\/debug': LogLevel.None,
 * };
 */
export const LOGGER_CONFIG: LoggerConfig = {
    loggers: {}
};
