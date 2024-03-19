/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { SetOutlineAction } from '@borkdominik-biguml/uml-protocol';
import { TYPES, configureActionHandler } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';
import { OutlineService } from './outline.handlers';

export const umlOutlineModule = new ContainerModule((bind, _unbind, isBound, rebind) => {
    const context = { bind, _unbind, isBound, rebind };
    bind(OutlineService).toSelf().inSingletonScope();
    bind(TYPES.IDiagramStartup).toService(OutlineService);
    bind(TYPES.IGModelRootListener).toService(OutlineService);
    configureActionHandler(context, SetOutlineAction.KIND, OutlineService);
});
