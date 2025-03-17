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
package com.borkdominik.big.glsp.uml.uml.elements.class_;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Package;

import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateNodeSemanticCommand;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.handler.operations.integrations.BGEMFNodeOperationHandler;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.uml.elements.packageable_element.CreatePackagableElementCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ClassOperationHandler extends BGEMFNodeOperationHandler<Class, Package> {

   @Inject
   public ClassOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);
   }

   @Override
   protected BGCreateNodeSemanticCommand<Class, Package, ?> createSemanticCommand(
      final CreateNodeOperation operation,
      final Package parent) {
      var argument = CreatePackagableElementCommand.Argument
         .<Class> createPackageableElementArgumentBuilder()
         .supplier((x) -> {
             var name = "Class";
             var isAbstract = false;
             if (operation.getArgs() != null) {
                 if (operation.getArgs().containsKey("name")) {
                     name = operation.getArgs().get("name");
                 }
                 if (operation.getArgs().containsKey("is_abstract")) {
                     isAbstract = Boolean.parseBoolean(operation.getArgs().get("is_abstract"));
                 }
             }
             return x.createOwnedClass(name, isAbstract);
         })
         .build();

      return new CreatePackagableElementCommand<>(commandContext, parent, argument);
   }
}
