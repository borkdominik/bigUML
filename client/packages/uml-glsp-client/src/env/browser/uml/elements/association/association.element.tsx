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

export class GAssociationEdge extends GEdge {}

@injectable()
export class GAssociationEdgeView extends GEdgeView {}

export class GAggregationEdge extends GEdge {}

@injectable()
export class GAggregationEdgeView extends GEdgeView {}

export class GCompositionEdge extends GEdge {}

@injectable()
export class GCompositionEdgeView extends GEdgeView {}
