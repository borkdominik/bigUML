/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { injectable } from 'inversify';
import { RoundedNodeView } from '../../views/rounded-node.view.js';

/**
 * A state is the rounded box, drawn by the view the activity diagram's action shares - the two are the
 * same notation, and keeping one implementation is what stops them drifting apart.
 */
@injectable()
export class StateNodeView extends RoundedNodeView {}
