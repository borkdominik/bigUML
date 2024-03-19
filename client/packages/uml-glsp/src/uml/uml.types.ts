/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { DefaultTypes } from '@eclipse-glsp/client';

export namespace UMLGModelTypes {
    export const LABEL_NAME = `${DefaultTypes.LABEL}:name`;
    export const LABEL_TEXT = `${DefaultTypes.LABEL}:text`;
    export const LABEL_EDGE_NAME = `${DefaultTypes.LABEL}:edge-name`;
    export const ICON = 'icon';
    export const ICON_CSS = `${ICON}:css`;
    export const DIVIDER = 'divider';
    export const COMPARTMENT_HEADER = 'comp:header';
    export const COMPARTMENT_ROOT_COMPONENT = 'comp:root-component';
    export const COMPARTMENT_CONTAINER = 'comp:container';
}
