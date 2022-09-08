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
import { Connectable, SLabel, SRoutableElement } from "@eclipse-glsp/client";

import { Icon } from "../../model";

// USECASE
export class IconUseCase extends Icon {
    iconImageName = "usecase/UseCase.gif";
}

export class IconActor extends Icon {
    iconImageName = "usecase/Actor.gif";
}

export class IconPackage extends Icon {
    iconImageName = "usecase/Package.gif";
}

export class ConnectionPoint extends SLabel implements Connectable {
    canConnect(routable: SRoutableElement, role: "source" | "target"): boolean {
        return true;
        // TODO: If neccessary return false under some conditions
    }

    selected = false;
    hoverFeedback = false;
    opacity = 1;
}
