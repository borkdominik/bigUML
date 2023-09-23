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
package com.eclipsesource.uml.modelserver.uml.elements.artifact.commands;

import java.util.function.Function;

import org.eclipse.uml2.uml.Artifact;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public class AddNestedArtifactSemanticCommand
   extends BaseCreateSemanticChildCommand<Artifact, Artifact> {

   protected final Function<Artifact, Artifact> supplier;

   public AddNestedArtifactSemanticCommand(final ModelContext context,
      final Artifact parent, final Function<Artifact, Artifact> supplier) {
      super(context, parent);
      this.supplier = supplier;
   }

   @Override
   protected Artifact createSemanticElement(final Artifact parent) {
      var element = supplier.apply(parent);
      var nameGenerator = new ListNameGenerator(element.getClass(), parent.allNamespaces());
      element.setName(nameGenerator.newName());
      parent.getNestedArtifacts().add(element);
      return element;
   }

}
