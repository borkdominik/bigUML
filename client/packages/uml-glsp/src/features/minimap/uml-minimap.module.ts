/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { RequestMinimapExportSvgAction } from '@borkdominik-biguml/uml-protocol';
import { TYPES, configureActionHandler, configureCommand } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';
import { MinimapExportSvgCommand, MinimapExportSvgPostprocessor, MinimapGLSPSvgExporter, MinimapHandler } from './minimap.handler';

export const umlMinimapModule = new ContainerModule((bind, _unbind, isBound, rebind) => {
    const context = { bind, _unbind, isBound, rebind };
    configureCommand(context, MinimapExportSvgCommand);
    bind(MinimapGLSPSvgExporter).toSelf().inSingletonScope();
    bind(MinimapHandler).toSelf().inSingletonScope();
    configureActionHandler(context, RequestMinimapExportSvgAction.KIND, MinimapHandler);

    bind(MinimapExportSvgPostprocessor).toSelf().inSingletonScope();
    bind(TYPES.HiddenVNodePostprocessor).toService(MinimapExportSvgPostprocessor);
    configureCommand({ bind, isBound }, MinimapExportSvgCommand);
});
