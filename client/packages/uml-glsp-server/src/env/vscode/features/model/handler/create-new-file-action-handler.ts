/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { CreateNewFileAction, CreateNewFileResponseAction } from '@borkdominik-biguml/uml-glsp-server';
import { UmlDiagramLSPServices } from '@borkdominik-biguml/uml-model-server/integration';
import { type Action, type ActionHandler, type MaybePromise } from '@eclipse-glsp/server';
import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import * as path from 'path';
import { URI } from 'vscode-uri';
import { getEmptyDiagram } from '../../../../../gen/vscode/get-empty-diagram.js';

@injectable()
export class CreateNewFileActionHandler implements ActionHandler {
    actionKinds = [CreateNewFileAction.KIND];

    @inject(UmlDiagramLSPServices)
    readonly services: UmlDiagramLSPServices;

    execute(action: CreateNewFileAction): MaybePromise<Action[]> {
        const sourceUri = action.options.sourceUri;
        const filePath = `${URI.parse(sourceUri).fsPath}.uml`;
        const dirPath = path.dirname(filePath);

        const model = getEmptyDiagram(action.diagramType);
        if (!model) {
            throw new Error(`Unsupported diagram type: ${action.diagramType}`);
        }

        fs.mkdirSync(dirPath, { recursive: true });
        fs.writeFileSync(filePath, this.services.language.serializer.Serializer.serialize(model));

        return [CreateNewFileResponseAction.create(sourceUri, action.requestId)];
    }
}
