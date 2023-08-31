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
package com.eclipsesource.uml.modelserver.uml.elements.state.commands;

import org.eclipse.uml2.uml.Region;
import org.eclipse.uml2.uml.State;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public class CreateSubStateSemanticCommand extends BaseCreateSemanticChildCommand<State, State> {

   public CreateSubStateSemanticCommand(final ModelContext context, final State parent) {
      super(context, parent);
   }

   @Override
   protected State createSemanticElement(final State parent) {
      var nameGenerator = new ListNameGenerator(State.class,
         parent.getRegions());

      var state = UMLFactory.eINSTANCE.createState();
      state.setName(nameGenerator.newName());

      var nameGeneratorRegion = new ListNameGenerator(Region.class,
         parent.getRegions());

      var region = UMLFactory.eINSTANCE.createRegion();
      region.setName(nameGeneratorRegion.newName());

      parent.getRegions().add(region);
      region.getSubvertices().add(state);

      return state;
   }

}
