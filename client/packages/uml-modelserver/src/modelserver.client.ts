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

import { ModelServerClientV2, ModelServerMessage } from '@eclipse-emfcloud/modelserver-client';
import { UmlDiagramType } from '@eclipsesource/uml-glsp/lib/common/uml-language';
import { AxiosResponse } from 'axios';
import URI from 'urijs';
import { ModelServerConfig } from './config';
import { UmlModelServerPaths } from './modelserver.path';

export class UmlModelServerClient extends ModelServerClientV2 {
    constructor(protected readonly config: ModelServerConfig) {
        super();
        this.initialize(new URI(this.config.url));
    }

    async createUmlResource(modelName: string, diagramType: UmlDiagramType): Promise<AxiosResponse<ModelServerMessage>> {
        const newModelUri = `${modelName}/model/${modelName}.uml`;
        return this.restClient.get(`${UmlModelServerPaths.CREATE_UML}?modeluri=${newModelUri}&diagramtype=${diagramType}`);
    }
}
