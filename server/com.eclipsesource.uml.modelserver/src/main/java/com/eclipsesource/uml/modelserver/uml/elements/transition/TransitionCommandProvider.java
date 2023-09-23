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
package com.eclipsesource.uml.modelserver.uml.elements.transition;

import java.util.Collection;
import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.uml2.uml.Transition;
import org.eclipse.uml2.uml.Vertex;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddEdgeNotationCommand;
import com.eclipsesource.uml.modelserver.uml.command.provider.element.EdgeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.transition.commands.CreateTransitionSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.transition.commands.UpdateTransitionArgument;
import com.eclipsesource.uml.modelserver.uml.elements.transition.commands.UpdateTransitionSemanticCommand;

public class TransitionCommandProvider extends EdgeCommandProvider<Transition, Vertex, Vertex> {

   @Override
   protected Collection<Command> createModifications(final ModelContext context, final Vertex source,
      final Vertex target) {
      var semantic = new CreateTransitionSemanticCommand(context, source,
         target);
      var notation = new AddEdgeNotationCommand(context, semantic::getSemanticElement);
      return List.of(semantic, notation);
   }

   @Override
   protected Collection<Command> updateModifications(final ModelContext context, final Transition element) {
      var decoder = new ContributionDecoder(context);
      var update = decoder.embedJson(UpdateTransitionArgument.class);
      return List.of(new UpdateTransitionSemanticCommand(context, element, update));
   }
}
