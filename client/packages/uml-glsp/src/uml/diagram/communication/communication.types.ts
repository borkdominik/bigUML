/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

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
