/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
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
