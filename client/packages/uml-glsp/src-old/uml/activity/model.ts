/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { DiamondNode } from '@eclipse-glsp/client';

import { Icon } from '../../model';

// ACTIVITY
export class IconActivity extends Icon {
    override iconImageName = 'activity/Activity.svg';
}

// TODO: Missing?
export class IconAction extends Icon {
    override iconImageName = 'OpaqueAction.gif';
}

export class ControlNode extends DiamondNode {
    override size = {
        width: 32,
        height: 32
    };
    override strokeWidth = 1;
}
