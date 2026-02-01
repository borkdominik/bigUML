/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import {
    type ActionHandlerConstructor,
    DiagramModule,
    type InstanceMultiBinding,
    type OperationHandlerConstructor
} from '@eclipse-glsp/server';

export class FeatureDiagramModule {
    configureOperationHandlers?(binding: InstanceMultiBinding<OperationHandlerConstructor>): void;
    configureActionHandlers?(binding: InstanceMultiBinding<ActionHandlerConstructor>): void;
}

export abstract class BigDiagramModule extends DiagramModule {
    protected featureDiagramModules: FeatureDiagramModule[] = [];

    addFeatureDiagramModule(module: FeatureDiagramModule): void {
        this.featureDiagramModules.push(module);
    }

    protected override configureOperationHandlers(binding: InstanceMultiBinding<OperationHandlerConstructor>): void {
        super.configureOperationHandlers(binding);

        for (const module of this.featureDiagramModules) {
            module.configureOperationHandlers?.(binding);
        }
    }

    protected override configureActionHandlers(binding: InstanceMultiBinding<ActionHandlerConstructor>): void {
        super.configureActionHandlers(binding);

        for (const module of this.featureDiagramModules) {
            module.configureActionHandlers?.(binding);
        }
    }
}
