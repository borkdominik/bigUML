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
package com.eclipsesource.uml.modelserver.uml.elements.execution_environment.commands;

import java.util.List;

import org.eclipse.uml2.uml.ExecutionEnvironment;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseUpdateSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.elements.node.commands.UpdateNodeSemanticCommand;

public final class UpdateExecutionEnvironmentSemanticCommand
   extends BaseUpdateSemanticElementCommand<ExecutionEnvironment, UpdateExecutionEnvironmentArgument> {

   public UpdateExecutionEnvironmentSemanticCommand(final ModelContext context,
      final ExecutionEnvironment semanticElement,
      final UpdateExecutionEnvironmentArgument updateArgument) {
      super(context, semanticElement, updateArgument);
   }

   @Override
   protected void updateSemanticElement(final ExecutionEnvironment semanticElement,
      final UpdateExecutionEnvironmentArgument updateArgument) {
      include(List.of(new UpdateNodeSemanticCommand(context, semanticElement, updateArgument)));

   }

}
