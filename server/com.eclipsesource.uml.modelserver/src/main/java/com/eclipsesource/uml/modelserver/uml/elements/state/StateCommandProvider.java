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
package com.eclipsesource.uml.modelserver.uml.elements.state;

import java.util.Collection;
import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Region;
import org.eclipse.uml2.uml.State;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddShapeNotationCommand;
import com.eclipsesource.uml.modelserver.uml.command.provider.element.NodeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.state.commands.CreateStateSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.state.commands.UpdateStateArgument;
import com.eclipsesource.uml.modelserver.uml.elements.state.commands.UpdateStateSemanticCommand;

public class StateCommandProvider extends NodeCommandProvider<State, Region> {

   @Override
   protected Collection<Command> createModifications(final ModelContext context, final Region parent,
      final GPoint position) {
      var semantic = new CreateStateSemanticCommand(context, parent);
      var notation = new AddShapeNotationCommand(
         context, semantic::getSemanticElement, position, GraphUtil.dimension(160, 50));
      return List.of(semantic, notation);
   }

   @Override
   protected Collection<Command> updateModifications(final ModelContext context, final State element) {
      var decoder = new ContributionDecoder(context);
      var update = decoder.embedJson(UpdateStateArgument.class);
      return List.of(new UpdateStateSemanticCommand(context, element, update));
   }

}
