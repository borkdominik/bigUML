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
package com.borkdominik.big.glsp.uml.uml.elements.pin;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.OpaqueAction;
import org.eclipse.uml2.uml.Pin;

import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateNodeSemanticCommand;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.handler.operations.integrations.BGEMFNodeOperationHandler;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateNodeCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class PinOperationHandler extends BGEMFNodeOperationHandler<Pin, OpaqueAction> {

   @Inject
   public PinOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);

   }

   @Override
   protected BGCreateNodeSemanticCommand<Pin, OpaqueAction, ?> createSemanticCommand(
      final CreateNodeOperation operation,
      final OpaqueAction parent) {
      var argument = UMLCreateNodeCommand.Argument
         .<Pin, OpaqueAction> createChildArgumentBuilder()
         .supplier((par) -> {
            if (operation.getElementTypeId().equals(UMLTypes.INPUT_PIN.prefix(representation))) {
               return par.createInputValue(null, null);
            } else if (operation.getElementTypeId().equals(UMLTypes.OUTPUT_PIN.prefix(representation))) {
               return par.createOutputValue(null, null);
            }
            return null;
         })
         .build();

      return new UMLCreateNodeCommand<>(commandContext, parent, argument);
   }
}
