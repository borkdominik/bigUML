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
