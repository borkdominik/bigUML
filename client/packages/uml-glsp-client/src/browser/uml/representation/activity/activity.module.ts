/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { UMLDiagramType } from '@borkdominik-biguml/uml-protocol';
import { FeatureModule } from '@eclipse-glsp/client';
import {
    registerActivityElement,
    registerActivityNodeElement,
    registerActivityPartitionElement,
    registerControlFlowElement,
    registerPinElement
} from '../../elements/index.js';

export const umlActivityDiagramModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    registerActivityElement(context, UMLDiagramType.ACTIVITY);
    registerActivityNodeElement(context, UMLDiagramType.ACTIVITY);
    registerActivityPartitionElement(context, UMLDiagramType.ACTIVITY);
    registerPinElement(context, UMLDiagramType.ACTIVITY);
    registerControlFlowElement(context, UMLDiagramType.ACTIVITY);
});
