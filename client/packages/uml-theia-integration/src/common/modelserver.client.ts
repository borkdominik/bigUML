/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/

import { UmlModelServerApi } from '@borkdominik-bigUML/uml-modelserver/lib/modelserver.client';
import { TheiaBackendModelServerClientV2 } from '@eclipse-emfcloud/modelserver-theia/lib/node/theia-model-server-client-v2';

export const UTModelServerClient = Symbol('UTModelServerClient');
export interface UTModelServerClient extends TheiaBackendModelServerClientV2, UmlModelServerApi {}
