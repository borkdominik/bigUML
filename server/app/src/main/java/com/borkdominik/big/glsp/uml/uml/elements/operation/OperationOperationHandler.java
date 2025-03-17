/********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.operation;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.OperationOwner;
import org.eclipse.uml2.uml.VisibilityKind;

import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateNodeSemanticCommand;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.handler.operations.integrations.BGEMFNodeOperationHandler;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateNodeCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class OperationOperationHandler extends BGEMFNodeOperationHandler<Operation, EObject> {

   @Inject
   public OperationOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);

   }

   @Override
   protected BGCreateNodeSemanticCommand<Operation, EObject, ?> createSemanticCommand(
      final CreateNodeOperation operation,
      final EObject parent) {
      var argument = UMLCreateNodeCommand.Argument
         .<Operation, EObject> createChildArgumentBuilder()
         .supplier((x) -> {
            if (x instanceof OperationOwner y) {

               String name = null;
               VisibilityKind visibility = null;
               if (operation.getArgs() != null) {
                  name = operation.getArgs().getOrDefault("name", null);
                  visibility = VisibilityKind.get(operation.getArgs().getOrDefault("visibility", null));
               }

               var element = y.createOwnedOperation(name, null, null);
               if (visibility != null) {
                  element.setVisibility(visibility);
               }
               return element;
            }

            return null;
         })
         .build();

      return new UMLCreateNodeCommand<>(commandContext, parent, argument);
   }

}
