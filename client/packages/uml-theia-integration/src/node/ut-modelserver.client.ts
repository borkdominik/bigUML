/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { AnyObject, Format, MessageDataMapper, ModelServerPaths, TypeGuard } from '@eclipse-emfcloud/modelserver-client';
import { TheiaBackendModelServerClientV2 } from '@eclipse-emfcloud/modelserver-theia/lib/node';
import { injectable } from 'inversify';
import { UTModelServerClient } from '../common/modelserver.client';

@injectable()
export class UTBackendModelServerClient extends TheiaBackendModelServerClientV2 implements UTModelServerClient {
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
