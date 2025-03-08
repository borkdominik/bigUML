/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import { GLSPHiddenBoundsUpdater } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class UMLHiddenBoundsUpdater extends GLSPHiddenBoundsUpdater {}
