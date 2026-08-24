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
import { GEditableLabel } from '../../views/uml-label.view.js';

export class GMessageEdge extends GEdge {}

@injectable()
export class GMessageEdgeView extends GEdgeView {}

/**
 * The label of a message on a communication diagram: its name, and the arrow beside the link showing
 * which way it runs.
 *
 * A class of its own rather than a plain `GEditableLabel` because these labels are placed by
 * `MessageArrowLayoutPostprocessor` instead of by GLSP's edge layout, which has to be able to tell
 * them apart from every other label written along an edge.
 */
export class GMessageArrowLabel extends GEditableLabel {}
