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
package com.eclipsesource.uml.modelserver.uml.elements.pseudostate.commands;

import org.eclipse.uml2.uml.Pseudostate;
import org.eclipse.uml2.uml.Region;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public class CreatePseudostateSemanticCommand extends BaseCreateSemanticChildCommand<Region, Pseudostate> {

   private final CreatePseudostateArgument argument;

   public CreatePseudostateSemanticCommand(final ModelContext context, final Region parent,
      final CreatePseudostateArgument argument) {
      super(context, parent);
      this.argument = argument;
   }

   @Override
   protected Pseudostate createSemanticElement(final Region parent) {
      var nameGenerator = new ListNameGenerator(Pseudostate.class,
         parent.getSubvertices());

      var pseudostate = UMLFactory.eINSTANCE.createPseudostate();
      pseudostate.setName(nameGenerator.newName());
      pseudostate.setKind(this.argument.pseudostateKind);

      parent.getSubvertices().add(pseudostate);

      return pseudostate;
   }

}
