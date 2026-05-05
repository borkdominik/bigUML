/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { GEdge, GEdgeView } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

export class GSubstitutionEdge extends GEdge {}

@injectable()
export class GSubstitutionEdgeView extends GEdgeView {}
