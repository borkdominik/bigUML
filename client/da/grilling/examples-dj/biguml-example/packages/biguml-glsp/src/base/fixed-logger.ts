/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { ConsoleLogger } from '@eclipse-glsp/client';

export class FixedLogger extends ConsoleLogger {
    protected override consoleArguments(thisArg: any, message: string, params: any[]): any[] {
        let caller: any;
        if (typeof thisArg === 'object') {
            caller = thisArg.constructor.name;
        } else {
            caller = thisArg;
        }
        const date = new Date();
        return [date.toLocaleTimeString() + ' ' + this.viewOptions.baseDiv + ' ' + caller + ': ', message, ...params];
    }
}
