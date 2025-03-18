/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { UMLDiagramType } from '@borkdominik-biguml/uml-protocol';
import { FeatureModule } from '@eclipse-glsp/client';
import {
    registerAbstractionElement,
    registerAssociationElement,
    registerClassElement,
    registerDataTypeElement,
    registerDependencyElement,
    registerEnumerationElement,
    registerEnumerationLiteralElement,
    registerGeneralizationElement,
    registerInstanceSpecificationElement,
    registerInterfaceElement,
    registerInterfaceRealizationElement,
    registerOperationElement,
    registerPackageElement,
    registerPackageImportElement,
    registerPackageMergeElement,
    registerParameterElement,
    registerPrimitiveTypeElement,
    registerPropertyElement,
    registerRealizationElement,
    registerSlotElement,
    registerSubstitutionElement,
    registerUsageElement
} from '../../elements/index.js';

export const umlClassDiagramModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    registerClassElement(context, UMLDiagramType.CLASS);
    registerDataTypeElement(context, UMLDiagramType.CLASS);
    registerEnumerationElement(context, UMLDiagramType.CLASS);
    registerEnumerationLiteralElement(context, UMLDiagramType.CLASS);
    registerInterfaceElement(context, UMLDiagramType.CLASS);
    registerOperationElement(context, UMLDiagramType.CLASS);
    registerPackageElement(context, UMLDiagramType.CLASS);
    registerParameterElement(context, UMLDiagramType.CLASS);
    registerPropertyElement(context, UMLDiagramType.CLASS);
    registerPrimitiveTypeElement(context, UMLDiagramType.CLASS);
    registerSlotElement(context, UMLDiagramType.CLASS);
    registerInstanceSpecificationElement(context, UMLDiagramType.CLASS);

    registerAbstractionElement(context, UMLDiagramType.CLASS);
    registerAssociationElement(context, UMLDiagramType.CLASS);
    registerDependencyElement(context, UMLDiagramType.CLASS);
    registerInterfaceRealizationElement(context, UMLDiagramType.CLASS);
    registerGeneralizationElement(context, UMLDiagramType.CLASS);
    registerRealizationElement(context, UMLDiagramType.CLASS);
    registerSubstitutionElement(context, UMLDiagramType.CLASS);
    registerUsageElement(context, UMLDiagramType.CLASS);
    registerPackageImportElement(context, UMLDiagramType.CLASS);
    registerPackageMergeElement(context, UMLDiagramType.CLASS);
});
