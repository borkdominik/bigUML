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
package com.eclipsesource.uml.modelserver.uml.elements.message;

import java.util.Collection;
import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.Message;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddEdgeNotationCommand;
import com.eclipsesource.uml.modelserver.uml.command.provider.element.EdgeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.message.commands.CreateMessageSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.message.commands.UpdateMessageArgument;
import com.eclipsesource.uml.modelserver.uml.elements.message.commands.UpdateMessageSemanticCommand;

public class MessageCommandProvider
   extends EdgeCommandProvider<Message, Lifeline, Lifeline> {
   @Override
   protected Collection<Command> createModifications(final ModelContext context, final Lifeline source,
      final Lifeline target) {
      var semantic = new CreateMessageSemanticCommand(context, source,
         target);
      var notation = new AddEdgeNotationCommand(context, semantic::getSemanticElement);
      return List.of(semantic, notation);
   }

   @Override
   protected Collection<Command> updateModifications(final ModelContext context, final Message element) {
      var decoder = new ContributionDecoder(context);
      var update = decoder.embedJson(UpdateMessageArgument.class);
      return List.of(new UpdateMessageSemanticCommand(context, element, update));
   }
}
