/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { TYPES, ViewerOptions } from '@eclipse-glsp/client';
import { ContainerModule, inject, injectable } from 'inversify';
import { UML_TYPES } from '../../di.types';

export const initializationModule = new ContainerModule(bind => {
    bind(LoadingHandler).toSelf().inSingletonScope();
    bind(UML_TYPES.IOnceModelInitialized).toService(LoadingHandler);
});

export interface IOnceModelInitialized {
    onceModelInitialized(): void;
}

@injectable()
export class LoadingHandler implements IOnceModelInitialized {
    constructor(@inject(TYPES.ViewerOptions) protected readonly viewerOptions: ViewerOptions) {}

    onceModelInitialized(): void {
        document.getElementById(this.viewerOptions.baseDiv + '_loading')?.remove();
    }
}
