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
package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.artifact;

import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.ExecutionEnvironment;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public class CreateArtifactExecutionEnvironmentSemanticCommand
   extends BaseCreateSemanticChildCommand<ExecutionEnvironment, Artifact> {

   public CreateArtifactExecutionEnvironmentSemanticCommand(final ModelContext context,
      final ExecutionEnvironment parent) {
      super(context, parent);
   }

   @Override
   protected Artifact createSemanticElement(final ExecutionEnvironment parent) {

      var nameGenerator = new ListNameGenerator(Artifact.class, parent.allNamespaces());

      var deploymentSpecifiaction = UMLFactory.eINSTANCE.createArtifact();
      deploymentSpecifiaction.setName(nameGenerator.newName());

      parent.getNestedClassifiers().add(deploymentSpecifiaction);

      return deploymentSpecifiaction;
   }

}
