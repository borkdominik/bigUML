/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { bindAsService, FeatureModule, type IDiagramStartup, TYPES, type ViewerOptions } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';

export const umlLoadingModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    bindAsService(context, TYPES.IDiagramStartup, LoadingHandler);
});

@injectable()
export class LoadingHandler implements IDiagramStartup {
    @inject(TYPES.ViewerOptions) protected readonly viewerOptions: ViewerOptions;

    postModelInitialization(): void {
        document.getElementById(this.viewerOptions.baseDiv + '_loading')?.remove();
    }
}
