/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { DefaultTypes } from '@eclipse-glsp/client';
import { UmlTypes } from '../../uml.types';

export namespace UmlCommunicationTypes {
    export const ICON_INTERACTION = `${UmlTypes.ICON}:interaction`;
    export const ICON_LIFELINE = `${UmlTypes.ICON}:lifeline`;
    export const INTERACTION = `${DefaultTypes.NODE}:interaction`;
    export const LIFELINE = `${DefaultTypes.NODE}:lifeline`;
    export const MESSAGE = `${DefaultTypes.EDGE}:message`;
    export const MESSAGE_LABEL_ARROW_EDGE_NAME = `${DefaultTypes.LABEL}:message-arrow-edge-name`;
}
