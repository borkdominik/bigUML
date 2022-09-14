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
import { Icon, SLabelNode } from "../../model";

// CLASS
export class IconProperty extends Icon {
    iconImageName = "class/Property.svg";
}

export class IconClass extends Icon {
    iconImageName = "class/Class.svg";
}

export class IconEnumeration extends Icon {
    iconImageName = "class/Enumeration.svg";
}

export class SLabelNodeProperty extends SLabelNode {
    imageName = "Property.svg";
}

