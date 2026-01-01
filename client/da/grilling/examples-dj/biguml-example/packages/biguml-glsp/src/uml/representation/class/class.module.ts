/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { UmlDiagramType } from '@borkdominik-biguml/uml-protocol';
import { ContainerModule } from 'inversify';
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
} from '../../elements/index';

export const umlClassDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    registerClassElement(context, UmlDiagramType.CLASS);
    registerDataTypeElement(context, UmlDiagramType.CLASS);
    registerEnumerationElement(context, UmlDiagramType.CLASS);
    registerEnumerationLiteralElement(context, UmlDiagramType.CLASS);
    registerInterfaceElement(context, UmlDiagramType.CLASS);
    registerOperationElement(context, UmlDiagramType.CLASS);
    registerPackageElement(context, UmlDiagramType.CLASS);
    registerParameterElement(context, UmlDiagramType.CLASS);
    registerPropertyElement(context, UmlDiagramType.CLASS);
    registerPrimitiveTypeElement(context, UmlDiagramType.CLASS);
    registerSlotElement(context, UmlDiagramType.CLASS);
    registerInstanceSpecificationElement(context, UmlDiagramType.CLASS);

    registerAbstractionElement(context, UmlDiagramType.CLASS);
    registerAssociationElement(context, UmlDiagramType.CLASS);
    registerDependencyElement(context, UmlDiagramType.CLASS);
    registerInterfaceRealizationElement(context, UmlDiagramType.CLASS);
    registerGeneralizationElement(context, UmlDiagramType.CLASS);
    registerRealizationElement(context, UmlDiagramType.CLASS);
    registerSubstitutionElement(context, UmlDiagramType.CLASS);
    registerUsageElement(context, UmlDiagramType.CLASS);
    registerPackageImportElement(context, UmlDiagramType.CLASS);
    registerPackageMergeElement(context, UmlDiagramType.CLASS);
});
