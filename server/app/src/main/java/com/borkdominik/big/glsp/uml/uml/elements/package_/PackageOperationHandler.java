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
package com.borkdominik.big.glsp.uml.uml.elements.package_;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.Package;

import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateNodeSemanticCommand;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.handler.operations.integrations.BGEMFNodeOperationHandler;
import com.borkdominik.big.glsp.uml.uml.elements.packageable_element.CreatePackagableElementCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class PackageOperationHandler extends BGEMFNodeOperationHandler<Package, Package> {

   @Inject
   public PackageOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);

   }

   @Override
   protected BGCreateNodeSemanticCommand<Package, Package, ?> createSemanticCommand(
      final CreateNodeOperation operation,
      final Package parent) {
      var argument = CreatePackagableElementCommand.Argument
         .<Package> createPackageableElementArgumentBuilder()
         .supplier((x) -> {
            var name = "Package";
            if (operation.getArgs() != null) {
               if (operation.getArgs().containsKey("name")) {
                  name = operation.getArgs().get("name");
               }
            }
            return x.createNestedPackage(name);
         })
         .build();

      return new CreatePackagableElementCommand<>(commandContext, parent, argument);
   }

}
