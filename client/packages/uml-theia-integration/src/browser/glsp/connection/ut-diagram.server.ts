/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { ActionHandlerRegistry } from '@eclipse-glsp/client';
import { GLSPTheiaDiagramServer } from '@eclipse-glsp/theia-integration/lib/browser';
import { injectable } from 'inversify';

@injectable()
export class UTDiagramServer extends GLSPTheiaDiagramServer {
    override initialize(registry: ActionHandlerRegistry): void {
        super.initialize(registry);

        // TODO: Enable them after the old diagrams are integrated again
        // registry.register(GetTypesAction.KIND, this);
        // registry.register(ReturnTypesAction.KIND, this);
        // registry.register(GetBehaviorsAction.KIND, this);
        // registry.register(CallBehaviorsAction.KIND, this);
    }
}
