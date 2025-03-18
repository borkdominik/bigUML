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
    registerActorElement,
    registerAssociationElement,
    registerExtendElement,
    registerGeneralizationElement,
    registerIncludeElement,
    registerPropertyElement,
    registerSubjectElement,
    registerUseCaseElement
} from '../../elements/index.js';

export const umlUseCaseDiagramModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    registerActorElement(context, UMLDiagramType.USE_CASE);
    registerAssociationElement(context, UMLDiagramType.USE_CASE);
    registerExtendElement(context, UMLDiagramType.USE_CASE);
    registerGeneralizationElement(context, UMLDiagramType.USE_CASE);
    registerIncludeElement(context, UMLDiagramType.USE_CASE);
    registerPropertyElement(context, UMLDiagramType.USE_CASE);
    registerSubjectElement(context, UMLDiagramType.USE_CASE);
    registerUseCaseElement(context, UMLDiagramType.USE_CASE);
});
