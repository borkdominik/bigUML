/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
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

import {
    AnyObject,
    Format,
    MessageDataMapper,
    ModelServerClientV2,
    ModelServerPaths,
    TypeGuard
} from '@eclipse-emfcloud/modelserver-client';
import URI from 'urijs';
import { ModelServerConfig } from './config';

export interface UmlModelServerApi {}

export class UmlModelServerClient extends ModelServerClientV2 implements UmlModelServerApi {
    constructor(protected readonly config: ModelServerConfig) {
        super();
        this.initialize(new URI(this.config.url));
    }

    dispose(): void {
        Array.from(this.openSockets.values()).forEach(openSocket => openSocket.close());
    }

    override create<M>(
        modeluri: URI,
        model: AnyObject | string,
        formatOrGuard?: FormatOrGuard<M>,
        format?: Format
    ): Promise<AnyObject | M> {
        if (format === 'raw-json') {
            return this.process(
                this.restClient.post(ModelServerPaths.MODEL_CRUD, model, {
                    params: { modeluri: modeluri.toString(), format }
                }),
                MessageDataMapper.asObject
            );
        } else {
            return super.create(modeluri, model, formatOrGuard as any, format);
        }
    }
}

type FormatOrGuard<M> = Format | TypeGuard<M>;
