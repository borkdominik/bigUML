/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type UMLDiagramType } from '@borkdominik-biguml/uml-protocol';
import { configureModelElement } from '@eclipse-glsp/client';
import { type interfaces } from 'inversify';
import { QualifiedUtil } from '../../qualified.utils.js';
import { NamedElement } from '../index.js';
import { UseCaseView } from './use-case.view.js';

export function registerUseCaseElement(
    context: { bind: interfaces.Bind; isBound: interfaces.IsBound },
    representation: UMLDiagramType
): void {
    configureModelElement(context, QualifiedUtil.typeId(representation, 'UseCase'), NamedElement, UseCaseView);
}
