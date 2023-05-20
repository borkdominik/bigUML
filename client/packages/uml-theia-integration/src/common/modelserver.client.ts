/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { UmlModelServerApi } from '@borkdominik-biguml/uml-modelserver/lib/modelserver.client';
import { TheiaBackendModelServerClientV2 } from '@eclipse-emfcloud/modelserver-theia/lib/node/theia-model-server-client-v2';

export const UTModelServerClient = Symbol('UTModelServerClient');
export interface UTModelServerClient extends TheiaBackendModelServerClientV2, UmlModelServerApi {}
