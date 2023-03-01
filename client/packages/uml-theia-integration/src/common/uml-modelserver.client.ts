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

import { TheiaBackendModelServerClientV2 } from '@eclipse-emfcloud/modelserver-theia/lib/node/theia-model-server-client-v2';
import { UmlModelServerApi } from '@eclipsesource/uml-modelserver/lib/modelserver.client';

export const UmlModelServerClient = Symbol('UmlModelServerClient');
export interface UmlModelServerClient extends TheiaBackendModelServerClientV2, UmlModelServerApi {}
