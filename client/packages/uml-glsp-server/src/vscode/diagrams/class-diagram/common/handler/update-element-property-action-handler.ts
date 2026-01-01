/**********************************************************************************
 * Copyright (c) 2026 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { inject, injectable } from 'inversify';
import { AbstractUpdateElementPropertyActionHandler } from '../../../../common/handler/abstract-element-property-action-handler.js';
import { ClassDiagramModelState } from '../../model/class-diagram-model-state.js';

@injectable()
export class ClassDiagramUpdateElementPropertyActionHandler extends AbstractUpdateElementPropertyActionHandler {
    @inject(ClassDiagramModelState)
    declare readonly modelState: ClassDiagramModelState;
}
