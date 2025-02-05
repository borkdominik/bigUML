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
package com.borkdominik.big.glsp.uml.uml.elements.parameter;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.Parameter;
import org.eclipse.uml2.uml.Type;
import org.eclipse.uml2.uml.VisibilityKind;

import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateNodeSemanticCommand;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.handler.operations.integrations.BGEMFNodeOperationHandler;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateNodeCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ParameterOperationHandler extends BGEMFNodeOperationHandler<Parameter, Operation> {

   @Inject
   public ParameterOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);

   }

   @Override
   protected BGCreateNodeSemanticCommand<Parameter, Operation, ?> createSemanticCommand(
      final CreateNodeOperation operation,
      final Operation parent) {
      var argument = UMLCreateNodeCommand.Argument
         .<Parameter, Operation> createChildArgumentBuilder()
         .supplier((x) -> {
            String name = null;
            Type type = null;

            if (operation.getArgs() != null) {
               name = operation.getArgs().getOrDefault("name", null);

               String type_id = operation.getArgs().getOrDefault("type_id", null);
               if (type_id != null) {
                  type = modelState.getElementIndex().getOrThrow(type_id, Type.class);
               }
            }

            var element = x.createOwnedParameter(name, type);
            element.setLower(1);
            element.setUpper(1);

            return element;
         })
         .build();

      return new UMLCreateNodeCommand<>(commandContext, parent, argument);
   }

}
