/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { Logger as BigLogger } from '@borkdominik-biguml/big-common';
import { loggerFactory as createBigLogger, LogLevel, resolveLogLevel } from '@borkdominik-biguml/big-common';
import { LogLevel as GlspLogLevel, InjectionContainer, Logger, LoggerFactory } from '@eclipse-glsp/server';
import { ContainerModule } from 'inversify';

export function fromCommonLogLevel(level: LogLevel): GlspLogLevel {
    switch (level) {
        case LogLevel.None:
            return GlspLogLevel.none;
        case LogLevel.Error:
            return GlspLogLevel.error;
        case LogLevel.Warn:
            return GlspLogLevel.warn;
        case LogLevel.Info:
            return GlspLogLevel.info;
        case LogLevel.Debug:
            return GlspLogLevel.debug;
        default:
            return GlspLogLevel.info;
    }
}

class BigUmlGlspLogger extends Logger {
    logLevel: GlspLogLevel;
    caller?: string;

    private bigLogger?: BigLogger;

    constructor(caller?: string) {
        super();
        this.caller = caller;
        this.logLevel = fromCommonLogLevel(resolveLogLevel(caller ?? 'glsp-server'));
    }

    info(message: string, ...params: any[]): void {
        this.getLogger().log(message, ...params);
    }

    warn(message: string, ...params: any[]): void {
        this.getLogger().warn(message, ...params);
    }

    error(message: string, ...params: any[]): void {
        this.getLogger().error(message, ...params);
    }

    debug(message: string, ...params: any[]): void {
        this.getLogger().log(message, ...params);
    }

    private getLogger(): BigLogger {
        if (!this.bigLogger) {
            const name = this.caller ?? 'glsp-server';
            this.bigLogger = createBigLogger(name, { logLevel: LogLevel.Debug });
        }
        return this.bigLogger;
    }
}

export function createBigAppModule(): ContainerModule {
    return new ContainerModule(bind => {
        bind(InjectionContainer).toDynamicValue(ctx => ctx.container);
        bind(Logger).toDynamicValue(() => new BigUmlGlspLogger());
        bind(LoggerFactory).toFactory(ctx => (caller: string) => {
            const logger = ctx.container.get(Logger);
            logger.caller = caller;
            return logger;
        });
    });
}
