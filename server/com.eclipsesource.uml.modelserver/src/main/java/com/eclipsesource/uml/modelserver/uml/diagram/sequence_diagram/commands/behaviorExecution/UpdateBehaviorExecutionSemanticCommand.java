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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.behaviorExecution;

import org.eclipse.uml2.uml.BehaviorExecutionSpecification;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;

public final class UpdateBehaviorExecutionSemanticCommand
   extends BaseUpdateSemanticElementCommand<BehaviorExecutionSpecification, UpdateBehaviorExecutionArgument> {

   public UpdateBehaviorExecutionSemanticCommand(final ModelContext context,
      final BehaviorExecutionSpecification semanticElement,
      final UpdateBehaviorExecutionArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final BehaviorExecutionSpecification semanticElement,
      final UpdateBehaviorExecutionArgument updateArgument) {
      updateArgument.name().ifPresent(arg -> {
         semanticElement.setName(arg);
      });

      updateArgument.visibilityKind().ifPresent(arg -> {
         semanticElement.setVisibility(arg);
      });
   }

}
