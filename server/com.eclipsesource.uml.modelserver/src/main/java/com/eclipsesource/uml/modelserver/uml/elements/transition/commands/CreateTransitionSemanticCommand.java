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
package com.eclipsesource.uml.modelserver.uml.elements.transition.commands;

import org.eclipse.uml2.uml.Transition;
import org.eclipse.uml2.uml.TransitionKind;
import org.eclipse.uml2.uml.UMLFactory;
import org.eclipse.uml2.uml.Vertex;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public class CreateTransitionSemanticCommand extends BaseCreateSemanticRelationCommand<Transition, Vertex, Vertex> {

   public CreateTransitionSemanticCommand(final ModelContext context, final Vertex source, final Vertex target) {
      super(context, source, target);
   }

   @Override
   protected Transition createSemanticElement(final Vertex source, final Vertex traget) {

      var nameGenerator = new ListNameGenerator(Transition.class,
         source.getContainer().getTransitions());

      var transition = UMLFactory.eINSTANCE.createTransition();
      transition.setName(nameGenerator.newName());

      transition.setSource(source);
      transition.setTarget(traget);
      transition.setKind(TransitionKind.EXTERNAL_LITERAL);

      source.getContainer().getTransitions().add(transition);

      return transition;
   }
}
