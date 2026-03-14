/********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import { minimatch } from 'minimatch';

import { LogLevel } from './log-level.js';
import { LOGGER_CONFIG } from './logger.config.js';
import { Logger } from './logger.js';

export interface LoggerOptions {
    /**
     * Explicitly sets the log level for this logger instance, overriding the LOGGER_CONFIG lookup.
     */
    logLevel?: LogLevel;
    /**
     * When true, all child loggers created from this logger inherit its log level
     * instead of performing their own LOGGER_CONFIG lookup.
     */
    applyToChildren?: boolean;
}

export function resolveLogLevel(name: string): LogLevel {
    for (const [pattern, level] of Object.entries(LOGGER_CONFIG.loggers)) {
        if (minimatch(name, pattern)) {
            return level;
        }
    }
    return LogLevel.Log;
}

/**
 * Creates a Logger instance.
 *
 * @param name - A string or array of strings joined with '/' to form the logger name.
 * @param options - Optional configuration to override log level or propagate level to children.
 */
export function loggerFactory(name: string | string[], options?: LoggerOptions): Logger {
    const resolvedName = Array.isArray(name) ? name.join('/') : name;
    const level = options?.logLevel ?? resolveLogLevel(resolvedName);
    return new Logger(resolvedName, level, options?.applyToChildren ?? false, resolveLogLevel);
}
