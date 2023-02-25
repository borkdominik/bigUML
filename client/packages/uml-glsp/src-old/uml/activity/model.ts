/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
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
