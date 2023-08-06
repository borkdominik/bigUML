/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { LitElement } from 'lit';
import { codiconStyle, defaultStyle } from './style';

export class BigElement extends LitElement {
    static override styles = [codiconStyle, defaultStyle];
}
