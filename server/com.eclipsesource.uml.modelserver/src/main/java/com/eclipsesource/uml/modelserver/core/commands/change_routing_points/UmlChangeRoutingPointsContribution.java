/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.core.commands.change_routing_points;

import java.util.List;
import java.util.Map;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.server.emf.model.notation.Edge;
import org.eclipse.glsp.server.types.ElementAndRoutingPoints;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionEncoder;

public class UmlChangeRoutingPointsContribution extends BasicCommandContribution<Command> {
   public static final String TYPE = "uml:change_routing_points";

   protected static CCommand create(final String semanticElementId, final List<GPoint> routingPoints) {
      var compoundCommand = new ContributionEncoder().type(TYPE).element(semanticElementId).ccompoundCommand();

      routingPoints.forEach(point -> {
         var childCommand = new ContributionEncoder().position(point).ccommand();
         compoundCommand.getCommands().add(childCommand);
      });

      return compoundCommand;
   }

   public static CCommand create(final Map<Edge, ElementAndRoutingPoints> changeRoutingPointsMap) {
      var compoundCommand = new ContributionEncoder().type(TYPE).ccompoundCommand();

      changeRoutingPointsMap.forEach((edge, elementAndRoutingPoints) -> {
         var childCommand = create(
            edge.getSemanticElement().getElementId(),
            elementAndRoutingPoints.getNewRoutingPoints());
         compoundCommand.getCommands().add(childCommand);
      });

      return compoundCommand;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      var decoder = new ContributionDecoder(modelUri, domain, command);

      var context = decoder.context();

      return new UmlChangeRoutingPointsCompoundCommand(context);
   }
}
