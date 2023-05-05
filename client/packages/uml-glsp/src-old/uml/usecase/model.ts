/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { Connectable, SLabel, SRoutableElement } from '@eclipse-glsp/client';

import { Icon } from '../../model';

// USECASE
export class IconUseCase extends Icon {
    override iconImageName = 'usecase/UseCase.gif';
}

export class IconActor extends Icon {
    override iconImageName = 'usecase/Actor.gif';
}

export class IconPackage extends Icon {
    override iconImageName = 'usecase/Package.gif';
}

export class ConnectionPoint extends SLabel implements Connectable {
    canConnect(routable: SRoutableElement, role: 'source' | 'target'): boolean {
        return true;
        // TODO: If neccessary return false under some conditions
    }

    override selected = false;
    hoverFeedback = false;
    override opacity = 1;
}
