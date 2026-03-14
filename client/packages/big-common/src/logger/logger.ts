/********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import { LogLevel } from './log-level.js';

export type LogLevelResolver = (name: string) => LogLevel;

export interface ChildLoggerOptions {
    logLevel?: LogLevel;
}

export class Logger {
    constructor(
        readonly name: string,
        private readonly level: LogLevel,
        private readonly applyToChildren: boolean,
        private readonly resolver: LogLevelResolver
    ) {}

    log(...args: unknown[]): void {
        if (this.level >= LogLevel.Log) {
            console.log(`[${this.name}]`, ...args);
        }
    }

    warn(...args: unknown[]): void {
        if (this.level >= LogLevel.Warn) {
            console.warn(`[${this.name}]`, ...args);
        }
    }

    error(...args: unknown[]): void {
        if (this.level >= LogLevel.Error) {
            console.error(`[${this.name}]`, ...args);
        }
    }

    child(name: string | string[], options?: ChildLoggerOptions): Logger {
        const segment = Array.isArray(name) ? name.join('/') : name;
        const childName = `${this.name}/${segment}`;
        const childLevel =
            options?.logLevel ?? (this.applyToChildren ? this.level : this.resolver(childName));
        return new Logger(childName, childLevel, this.applyToChildren, this.resolver);
    }
}
