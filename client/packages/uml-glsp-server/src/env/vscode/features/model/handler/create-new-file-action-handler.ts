/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { CreateNewFileAction, CreateNewFileResponseAction } from '@borkdominik-biguml/uml-glsp-server';
import type { SerializeAstNode } from '@borkdominik-biguml/uml-model-server';
import type { Diagram } from '@borkdominik-biguml/uml-model-server/grammar';
import { UmlDiagramLSPServices } from '@borkdominik-biguml/uml-model-server/integration';
import { type Action, type ActionHandler, type MaybePromise } from '@eclipse-glsp/server';
import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import * as path from 'path';

@injectable()
export class CreateNewFileActionHandler implements ActionHandler {
    actionKinds = [CreateNewFileAction.KIND];

    @inject(UmlDiagramLSPServices)
    readonly services: UmlDiagramLSPServices;

    execute(action: CreateNewFileAction): MaybePromise<Action[]> {
        const sourceUri = action.options.sourceUri;
        const filePath = `${sourceUri}.uml`;
        const dirPath = path.dirname(filePath);

        fs.mkdirSync(dirPath, { recursive: true });

        const minimalModel: SerializeAstNode<Diagram> = {
            $type: 'Diagram',
            diagram: {
                $type: 'ClassDiagram',
                __id: 'ClassDiagram1',
                diagramType: 'CLASS',
                entities: [],
                relations: []
            },
            metaInfos: []
        };

        fs.writeFileSync(filePath, this.services.language.serializer.Serializer.serialize(minimalModel));

        return [CreateNewFileResponseAction.create(sourceUri, action.requestId)];
    }
}
