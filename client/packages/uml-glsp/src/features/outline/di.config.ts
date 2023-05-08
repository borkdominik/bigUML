/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { configureActionHandler } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';

import { SetOutlineAction } from './outline.actions';
import { OutlineActionHandler } from './outline.handlers';

const outlineModule = new ContainerModule((bind, _unbind, isBound, rebind) => {
    const context = { bind, _unbind, isBound, rebind };
    bind(OutlineActionHandler).toSelf().inSingletonScope();
    configureActionHandler(context, SetOutlineAction.KIND, OutlineActionHandler);
});

export default outlineModule;
