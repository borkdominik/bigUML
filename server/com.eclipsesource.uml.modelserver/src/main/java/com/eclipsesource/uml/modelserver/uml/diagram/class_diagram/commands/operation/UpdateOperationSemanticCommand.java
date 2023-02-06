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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.operation;

import org.eclipse.uml2.uml.Operation;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;

public final class UpdateOperationSemanticCommand
   extends BaseUpdateSemanticElementCommand<Operation, UpdateOperationArgument> {

   public UpdateOperationSemanticCommand(final ModelContext context, final Operation semanticElement,
      final UpdateOperationArgument args) {
      super(context, semanticElement, args);
   }

   @Override
   protected void updateSemanticElement(final Operation semanticElement, final UpdateOperationArgument updateArgument) {
      updateArgument.isAbstract().ifPresent(arg -> {
         semanticElement.setIsAbstract(arg);
      });

      updateArgument.isStatic().ifPresent(arg -> {
         semanticElement.setIsStatic(arg);
      });

      updateArgument.isQuery().ifPresent(arg -> {
         semanticElement.setIsQuery(arg);
      });

      updateArgument.visibilityKind().ifPresent(arg -> {
         semanticElement.setVisibility(arg);
      });
   }

}
