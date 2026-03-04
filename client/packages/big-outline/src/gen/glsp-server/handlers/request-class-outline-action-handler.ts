// AUTO-GENERATED – DO NOT EDIT
/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { RequestOutlineAction, SetOutlineAction } from '@borkdominik-biguml/big-outline';
import { ActionHandler, MaybePromise } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import {} from '@borkdominik-biguml/uml-model-server/grammar';
import { DiagramModelState } from '@borkdominik-biguml/uml-glsp-server/vscode';

@injectable()
export class RequestClassOutlineActionHandler implements ActionHandler {
    actionKinds = [RequestOutlineAction.KIND];

    @inject(DiagramModelState)
    protected modelState!: DiagramModelState;

    execute(_action: RequestOutlineAction): MaybePromise<any[]> {
        // only ClassDiagram outlines
        if (this.modelState.semanticRoot.diagram.diagramType !== 'CLASS') {
            return [SetOutlineAction.create({ outlineTreeNodes: [] })];
        }
        const root = this.modelState.semanticRoot.diagram;
        const outlineTreeNodes = [
            {
                label: 'Model',
                semanticUri: root.__id,
                children: [],
                iconClass: 'model',
                isRoot: true
            }
        ];
        const entities = root.entities ?? [];
        entities.forEach((entity: any) => {
            const node: any = {
                label: entity.name,
                semanticUri: entity.__id,
                children: [],
                iconClass: 'element'
            };

            (outlineTreeNodes[0].children as any).push(node);
        });
        return [SetOutlineAction.create({ outlineTreeNodes })];
    }
}
