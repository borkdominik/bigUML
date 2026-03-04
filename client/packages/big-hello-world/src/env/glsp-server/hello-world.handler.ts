/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { type ActionHandler, type MaybePromise } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { HelloWorldActionResponse, RequestHelloWorldAction } from '../common/hello-world.action.js';

@injectable()
export class HelloWorldActionHandler implements ActionHandler {
    actionKinds = [RequestHelloWorldAction.KIND];

    private count = 0;

    execute(action: RequestHelloWorldAction): MaybePromise<any[]> {
        this.count += action.increase;
        console.log(`Hello World from GLSP server: ${this.count}`);
        return [HelloWorldActionResponse.create({ count: this.count })];
    }
}
