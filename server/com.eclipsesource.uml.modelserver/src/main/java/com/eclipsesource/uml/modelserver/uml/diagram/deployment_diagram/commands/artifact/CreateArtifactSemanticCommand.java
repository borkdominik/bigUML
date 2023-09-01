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

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public class CreateArtifactSemanticCommand extends BaseCreateSemanticChildCommand<Artifact, Artifact> {

   public CreateArtifactSemanticCommand(final ModelContext context, final Artifact parent) {
      super(context, parent);
   }

   @Override
   protected Artifact createSemanticElement(final Artifact parent) {

      var nameGenerator = new ListNameGenerator(Artifact.class, parent.getNestedArtifacts());

      return parent.createNestedArtifact(nameGenerator.newName());
   }

}
