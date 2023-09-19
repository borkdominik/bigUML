/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.elements.control_flow.commands;

import java.util.List;

import org.eclipse.uml2.uml.ControlFlow;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementSemanticCommand;

public class UpdateControlFlowSemanticCommand
   extends BaseUpdateSemanticElementCommand<ControlFlow, UpdateControlFlowArgument> {

   public UpdateControlFlowSemanticCommand(final ModelContext context, final ControlFlow semanticElement,
      final UpdateControlFlowArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final ControlFlow semanticElement,
      final UpdateControlFlowArgument updateArgument) {
      include(List.of(new UpdateNamedElementSemanticCommand(context, semanticElement, updateArgument)));

      updateArgument.guard().ifPresent(arg -> {
         var guard = UMLFactory.eINSTANCE.createLiteralString();
         guard.setValue(arg);

         semanticElement.setGuard(guard);
      });
      updateArgument.weight().ifPresent(arg -> {
         var weight = UMLFactory.eINSTANCE.createLiteralInteger();
         weight.setValue(arg);

         semanticElement.setWeight(weight);
      });

   }
}
