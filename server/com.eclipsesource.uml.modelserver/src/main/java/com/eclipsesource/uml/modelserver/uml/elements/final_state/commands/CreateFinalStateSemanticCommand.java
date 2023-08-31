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
package com.eclipsesource.uml.modelserver.uml.elements.final_state.commands;

import org.eclipse.uml2.uml.FinalState;
import org.eclipse.uml2.uml.Region;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public class CreateFinalStateSemanticCommand extends BaseCreateSemanticChildCommand<Region, FinalState> {

   public CreateFinalStateSemanticCommand(final ModelContext context, final Region parent) {
      super(context, parent);
   }

   @Override
   protected FinalState createSemanticElement(final Region parent) {
      var nameGenerator = new ListNameGenerator(FinalState.class,
         parent.getSubvertices());

      var state = UMLFactory.eINSTANCE.createFinalState();
      state.setName(nameGenerator.newName());

      parent.getSubvertices().add(state);

      return state;
   }

}
