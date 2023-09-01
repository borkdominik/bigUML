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
package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.execution_environment;

import org.eclipse.uml2.uml.ExecutionEnvironment;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeleteExecutionEnvironmentSemanticCommand
   extends BaseDeleteSemanticChildCommand<Package, ExecutionEnvironment> {

   public DeleteExecutionEnvironmentSemanticCommand(final ModelContext context,
      final ExecutionEnvironment semanticElement) {
      super(context, semanticElement.getNearestPackage(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Package parent, final ExecutionEnvironment child) {
      child.destroy();
   }
}
