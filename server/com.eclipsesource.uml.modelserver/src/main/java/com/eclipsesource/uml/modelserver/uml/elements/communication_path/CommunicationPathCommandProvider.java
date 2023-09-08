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
package com.eclipsesource.uml.modelserver.uml.elements.communication_path;

import java.util.Collection;
import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.uml2.uml.CommunicationPath;
import org.eclipse.uml2.uml.Node;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddEdgeNotationCommand;
import com.eclipsesource.uml.modelserver.uml.command.provider.element.EdgeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.communication_path.commands.CreateCommunicationPathArgument;
import com.eclipsesource.uml.modelserver.uml.elements.communication_path.commands.CreateCommunicationPathSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.communication_path.commands.UpdateCommunicationPathArgument;
import com.eclipsesource.uml.modelserver.uml.elements.communication_path.commands.UpdateCommunicationPathSemanticCommand;

public class CommunicationPathCommandProvider extends EdgeCommandProvider<CommunicationPath, Node, Node> {
   @Override
   protected Collection<Command> createModifications(final ModelContext context, final Node source,
      final Node target) {
      var argument = context.decoder().embedJson(CreateCommunicationPathArgument.class,
         new CreateCommunicationPathArgument.Deserializer());
      var semantic = new CreateCommunicationPathSemanticCommand(context, source,
         target, argument);
      var notation = new AddEdgeNotationCommand(context, semantic::getSemanticElement);
      return List.of(semantic, notation);
   }

   @Override
   protected Collection<Command> updateModifications(final ModelContext context, final CommunicationPath element) {
      var decoder = new ContributionDecoder(context);
      var update = decoder.embedJson(UpdateCommunicationPathArgument.class);
      return List.of(new UpdateCommunicationPathSemanticCommand(context, element, update));
   }
}
