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
package com.borkdominik.big.glsp.uml.uml.elements.property;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.AttributeOwner;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.Type;
import org.eclipse.uml2.uml.VisibilityKind;

import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateNodeSemanticCommand;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.handler.operations.integrations.BGEMFNodeOperationHandler;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateNodeCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class PropertyOperationHandler extends BGEMFNodeOperationHandler<Property, EObject> {

   @Inject
   public PropertyOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);

   }

   @Override
   protected BGCreateNodeSemanticCommand<Property, EObject, ?> createSemanticCommand(
      final CreateNodeOperation operation,
      final EObject parent) {
      var argument = UMLCreateNodeCommand.Argument
         .<Property, EObject> createChildArgumentBuilder()
         .supplier((x) -> {
            if (x instanceof AttributeOwner y) {
               String name = null;
               Type type = null;

               VisibilityKind visibility = null;
               if (operation.getArgs() != null) {
                  name = operation.getArgs().getOrDefault("name", null);

                  String type_id = operation.getArgs().getOrDefault("type_id", null);
                  if (type_id != null) {
                     type = modelState.getElementIndex().getOrThrow(type_id, Type.class);
                  }

                  visibility = VisibilityKind.get(operation.getArgs().getOrDefault("visibility", null));
               }

               var element = y.createOwnedAttribute(name, type);
               element.setLower(1);
               element.setUpper(1);

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
