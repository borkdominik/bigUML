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
package com.eclipsesource.uml.modelserver.uml.elements.operation.commands;

import java.util.List;

import org.eclipse.uml2.uml.Operation;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;
import com.eclipsesource.uml.modelserver.shared.semantic.OrderablePositionSemantic;
import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementSemanticCommand;

public class UpdateOperationSemanticCommand
   extends BaseUpdateSemanticElementCommand<Operation, UpdateOperationArgument>
   implements OrderablePositionSemantic {

   public UpdateOperationSemanticCommand(final ModelContext context, final Operation semanticElement,
      final UpdateOperationArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final Operation semanticElement, final UpdateOperationArgument updateArgument) {
      include(List.of(new UpdateNamedElementSemanticCommand(context, semanticElement, updateArgument)));

      updateArgument.isAbstract().ifPresent(arg -> {
         semanticElement.setIsAbstract(arg);
      });

      updateArgument.isStatic().ifPresent(arg -> {
         semanticElement.setIsStatic(arg);
      });

      updateArgument.isQuery().ifPresent(arg -> {
         semanticElement.setIsQuery(arg);
      });

      updateArgument.concurrency().ifPresent(arg -> {
         semanticElement.setConcurrency(arg);
      });

      updateArgument.parameterIndex().ifPresent(arg -> {
         reorder(semanticElement.getOwnedParameters(), arg);
      });
   }

}
