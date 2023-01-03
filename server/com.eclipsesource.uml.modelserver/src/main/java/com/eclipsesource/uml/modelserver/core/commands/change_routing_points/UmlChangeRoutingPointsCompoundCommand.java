/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.core.commands.change_routing_points;

import java.util.stream.Collectors;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.glsp.server.emf.model.notation.Edge;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.extension.NotationElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public class UmlChangeRoutingPointsCompoundCommand extends CompoundCommand {

   protected final ModelContext context;
   protected final ContributionDecoder decoder;
   protected final NotationElementAccessor notationElementAccessor;

   public UmlChangeRoutingPointsCompoundCommand(final ModelContext context) {
      this.context = context;
      this.decoder = new ContributionDecoder(context);
      this.notationElementAccessor = new NotationElementAccessor(context);

      var command = context.command;

      if (command instanceof CCompoundCommand) {
         ((CCompoundCommand) command)
            .getCommands().stream()
            .map(this::createCommand)
            .forEach(this::append);
      }
   }

   protected Command createCommand(final CCommand childCommand) {
      var semanticElementId = decoder.with(childCommand).elementId().get();
      var edge = notationElementAccessor.getElement(semanticElementId, Edge.class).get();

      var newRoutingPoints = ((CCompoundCommand) childCommand).getCommands()
         .stream()
         .map(routingCommand -> {
            return decoder.with(routingCommand).position().get();
         })
         .collect(Collectors.toList());

      return new UmlChangeRoutingPointsNotationCommand(context, edge, newRoutingPoints);

   }
}
