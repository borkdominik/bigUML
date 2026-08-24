/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { injectable } from 'inversify';
import { NamedElement } from '../named-element/index.js';
import { StateMachineNodeView } from './state_machine_node_view.js';

export class GStateMachineNode extends NamedElement {}

@injectable()
export class GStateMachineNodeView extends StateMachineNodeView {}
