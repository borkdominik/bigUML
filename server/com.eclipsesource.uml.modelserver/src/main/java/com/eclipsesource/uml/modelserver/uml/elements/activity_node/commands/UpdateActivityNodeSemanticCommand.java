/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.elements.activity_node.commands;

import java.util.List;
import java.util.function.Supplier;

import org.eclipse.uml2.uml.ActivityNode;
import org.eclipse.uml2.uml.ActivityPartition;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementSemanticCommand;

public final class UpdateActivityNodeSemanticCommand
   extends BaseUpdateSemanticElementCommand<ActivityNode, UpdateActivityNodeArgument> {

   public UpdateActivityNodeSemanticCommand(final ModelContext context, final ActivityNode semanticElement,
      final UpdateActivityNodeArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   public UpdateActivityNodeSemanticCommand(final ModelContext context, final Supplier<ActivityNode> semanticElement,
      final UpdateActivityNodeArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final ActivityNode semanticElement,
      final UpdateActivityNodeArgument updateArgument) {
      include(List.of(new UpdateNamedElementSemanticCommand(context, semanticElement, updateArgument)));

      updateArgument.inPartitionsIds().ifPresent(arg -> {
         var partitions = semanticElementAccessor.getElements(arg, ActivityPartition.class);
         semanticElement.getInPartitions().clear();
         semanticElement.getInPartitions().addAll(partitions);
      });
   }

}
