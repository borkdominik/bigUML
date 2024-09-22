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
package com.borkdominik.big.glsp.uml.uml.elements.activity_partition;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.ActivityPartition;

import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateNodeSemanticCommand;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.handler.operations.integrations.BGEMFNodeOperationHandler;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateNodeCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ActivityPartitionOperationHandler extends BGEMFNodeOperationHandler<ActivityPartition, EObject> {

   @Inject
   public ActivityPartitionOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);

   }

   @Override
   protected BGCreateNodeSemanticCommand<ActivityPartition, EObject, ?> createSemanticCommand(
      final CreateNodeOperation operation,
      final EObject parent) {
      var argument = UMLCreateNodeCommand.Argument
         .<ActivityPartition, EObject> createChildArgumentBuilder()
         .supplier((par) -> {
            if (par instanceof Activity p) {
               return p.createPartition(null);
            } else if (par instanceof ActivityPartition p) {
               return p.createSubpartition(null);
            }
            return null;
         })
         .build();

      return new UMLCreateNodeCommand<>(commandContext, parent, argument);
   }

}
