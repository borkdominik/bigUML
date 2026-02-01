// AUTO-GENERATED – DO NOT EDIT
/*********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
  RequestOutlineAction,
  SetOutlineAction,
} from '@borkdominik-biguml/big-outline';
import { ActionHandler, MaybePromise } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { isClass, isPackage } from '@borkdominik-biguml/model-server/grammar';
import { PackageDiagramModelState } from '@borkdominik-biguml/uml-glsp-server/vscode';

@injectable()
export class RequestPackageOutlineActionHandler implements ActionHandler {
  actionKinds = [RequestOutlineAction.KIND];

  @inject(PackageDiagramModelState)
  protected modelState!: PackageDiagramModelState;

  execute(_action: RequestOutlineAction): MaybePromise<any[]> {
    // only PackageDiagram outlines
    if (this.modelState.semanticRoot.diagram.diagramType !== 'PACKAGE') {
      return [SetOutlineAction.create({ outlineTreeNodes: [] })];
    }
    const root = this.modelState.semanticRoot.diagram;
    const outlineTreeNodes = [
      {
        label: 'Model',
        semanticUri: root.__id,
        children: [],
        iconClass: 'model',
        isRoot: true,
      },
    ];
    const entities = root.entities ?? [];
    entities.forEach((entity) => {
      const node: any = {
        label: entity.name,
        semanticUri: entity.__id,
        children: [],
        iconClass: 'element',
      };

      if (isClass(entity)) {
        node.iconClass = 'class';
        node.children.push(
          ...(entity.properties ?? []).map((child) => ({
            label: child.name,
            semanticUri: child.__id,
            children: [],
            iconClass: 'property',
          })),
        );
        node.children.push(
          ...(entity.operations ?? []).map((child) => ({
            label: child.name,
            semanticUri: child.__id,
            children: [],
            iconClass: 'operation',
          })),
        );
      }

      if (isPackage(entity)) {
        node.iconClass = 'package';
        node.children.push(
          ...(entity.entities ?? []).map((child) => ({
            label: child.name,
            semanticUri: child.__id,
            children: [],
            iconClass: 'entity',
          })),
        );
      }

      (outlineTreeNodes[0].children as any).push(node);
    });
    return [SetOutlineAction.create({ outlineTreeNodes })];
  }
}
