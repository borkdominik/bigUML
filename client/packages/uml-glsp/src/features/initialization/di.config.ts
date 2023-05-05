/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

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
