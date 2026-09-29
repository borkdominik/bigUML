/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { injectable } from 'inversify';
import { FrameNodeView } from '../../views/uml-frame.view.js';

/**
 * A state machine: the frame the states of a diagram are drawn on. Drawn like every other frame - see
 * `FrameNodeView`, which is also where its name tag comes from.
 */
@injectable()
export class StateMachineNodeView extends FrameNodeView {}
