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
package com.borkdominik.big.glsp.uml.uml.elements.use_case;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Component;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.UMLFactory;
import org.eclipse.uml2.uml.UseCase;

import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateNodeSemanticCommand;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.handler.operations.integrations.BGEMFNodeOperationHandler;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateNodeCommand;
import com.borkdominik.big.glsp.uml.uml.elements.packageable_element.CreatePackagableElementCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class UseCaseOperationHandler extends BGEMFNodeOperationHandler<UseCase, EObject> {

   @Inject
   public UseCaseOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);

   }

   @SuppressWarnings({ "unchecked", "rawtypes" })
   @Override
   protected BGCreateNodeSemanticCommand<UseCase, EObject, ?> createSemanticCommand(
      final CreateNodeOperation operation,
      final EObject parent) {
      if (parent instanceof Package pack) {
         var argument = CreatePackagableElementCommand.Argument
            .<UseCase> createPackageableElementArgumentBuilder()
            .supplier((p) -> UMLFactory.eINSTANCE.createUseCase())
            .build();

         return (BGCreateNodeSemanticCommand) new CreatePackagableElementCommand<>(
            commandContext, pack, argument);
      } else if (parent instanceof Component comp) {
         var argument = UMLCreateNodeCommand.Argument
            .<UseCase, Component> createChildArgumentBuilder()
            .supplier((x) -> x.createOwnedUseCase(null))
            .build();

         return (BGCreateNodeSemanticCommand) new UMLCreateNodeCommand<>(commandContext, comp, argument);
      }

      throw new GLSPServerException(
         String.format("Can not handle parent of type %s", parent.getClass().getSimpleName()));
   }

}
