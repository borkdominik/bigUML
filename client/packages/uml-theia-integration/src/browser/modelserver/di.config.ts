/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { TheiaModelServerClientV2 } from '@eclipse-emfcloud/modelserver-theia';
import { ContainerContext } from '@eclipse-glsp/theia-integration';
import { UTModelServerClient } from '../../common/modelserver.client';

export function registerModelServerModule(context: ContainerContext): void {
    // Workaround
    context.bind(UTModelServerClient).toService(TheiaModelServerClientV2);
}
