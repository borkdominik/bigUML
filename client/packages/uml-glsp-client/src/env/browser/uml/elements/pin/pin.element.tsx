/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { injectable } from 'inversify';
import { NamedElement, NamedElementView } from '../named-element/index.js';

export class GInputPinNode extends NamedElement {}

@injectable()
export class GInputPinNodeView extends NamedElementView {}

export class GOutputPinNode extends NamedElement {}

@injectable()
export class GOutputPinNodeView extends NamedElementView {}
