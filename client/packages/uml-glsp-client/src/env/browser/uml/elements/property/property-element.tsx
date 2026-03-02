/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { injectable } from 'inversify';
import { NamedElement, NamedElementView } from '../index.js';

export class GPropertyNode extends NamedElement {
    propertyType?: string;
    visibility: string = 'PUBLIC';
    multiplicity: string = '1';
}

@injectable()
export class GPropertyNodeView extends NamedElementView {}
