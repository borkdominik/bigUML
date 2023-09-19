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
package com.eclipsesource.uml.modelserver.uml.elements.control_flow;

import java.util.Collection;
import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.uml2.uml.ActivityNode;
import org.eclipse.uml2.uml.ControlFlow;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddEdgeNotationCommand;
import com.eclipsesource.uml.modelserver.uml.command.provider.element.EdgeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.control_flow.commands.CreateControlFlowSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.control_flow.commands.UpdateControlFlowArgument;
import com.eclipsesource.uml.modelserver.uml.elements.control_flow.commands.UpdateControlFlowSemanticCommand;

public class ControlFlowCommandProvider extends EdgeCommandProvider<ControlFlow, ActivityNode, ActivityNode> {
   @Override
   protected Collection<Command> createModifications(final ModelContext context, final ActivityNode source,
      final ActivityNode target) {
      var semantic = new CreateControlFlowSemanticCommand(context, source,
         target);
      var notation = new AddEdgeNotationCommand(context, semantic::getSemanticElement);
      return List.of(semantic, notation);
   }

   @Override
   protected Collection<Command> updateModifications(final ModelContext context, final ControlFlow element) {
      var decoder = new ContributionDecoder(context);
      var update = decoder.embedJson(UpdateControlFlowArgument.class);
      return List.of(new UpdateControlFlowSemanticCommand(context, element, update));
   }
}
