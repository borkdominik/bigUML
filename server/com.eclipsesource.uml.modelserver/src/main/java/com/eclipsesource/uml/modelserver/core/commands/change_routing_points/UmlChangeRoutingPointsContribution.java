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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.server.emf.model.notation.Edge;
import org.eclipse.glsp.server.types.ElementAndRoutingPoints;

import com.eclipsesource.uml.modelserver.shared.constants.NotationKeys;
import com.eclipsesource.uml.modelserver.shared.constants.SemanticKeys;
import com.eclipsesource.uml.modelserver.shared.extension.NotationElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.utils.UmlGraphUtil;

public class UmlChangeRoutingPointsContribution extends BasicCommandContribution<Command> {
   public static final String TYPE = "uml:changeRoutingPoints";

   public static CCommand create(final String semanticElementId, final List<GPoint> routingPoints) {
      var command = CCommandFactory.eINSTANCE.createCompoundCommand();
      command.setType(TYPE);
      command.getProperties().put(SemanticKeys.SEMANTIC_ELEMENT_ID, semanticElementId);

      routingPoints.forEach(point -> {
         var childCommand = CCommandFactory.eINSTANCE.createCommand();
         childCommand.getProperties().put(NotationKeys.POSITION_X, String.valueOf(point.getX()));
         childCommand.getProperties().put(NotationKeys.POSITION_Y, String.valueOf(point.getY()));
         command.getCommands().add(childCommand);
      });

      return command;
   }

   public static CCompoundCommand create(final Map<Edge, ElementAndRoutingPoints> changeRoutingPointsMap) {
      var compoundCommand = CCommandFactory.eINSTANCE.createCompoundCommand();

      compoundCommand.setType(TYPE);

      changeRoutingPointsMap.forEach((edge, elementAndRoutingPoints) -> {
         var changeRoutingPointsCommand = create(edge.getSemanticElement().getElementId(),
            elementAndRoutingPoints.getNewRoutingPoints());
         compoundCommand.getCommands().add(changeRoutingPointsCommand);
      });

      return compoundCommand;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      var context = ModelContext.of(modelUri, domain, command);
      var compoundCommand = new CompoundCommand();

      if (command instanceof CCompoundCommand) {
         var notationElementAccessor = new NotationElementAccessor(context);

         ((CCompoundCommand) command).getCommands().forEach(changeRoutingPointCommand -> {
            var semanticElementId = changeRoutingPointCommand.getProperties().get(SemanticKeys.SEMANTIC_ELEMENT_ID);
            var newRoutingPoints = new ArrayList<GPoint>();

            ((CCompoundCommand) changeRoutingPointCommand).getCommands().forEach(cmd -> {
               var routingPoint = UmlGraphUtil.getGPoint(
                  cmd.getProperties().get(NotationKeys.POSITION_X), cmd.getProperties().get(NotationKeys.POSITION_Y));
               newRoutingPoints.add(routingPoint);
            });

            var edge = notationElementAccessor.getElement(semanticElementId, Edge.class).get();

            compoundCommand.append(
               new UmlChangeRoutingPointsNotationCommand(context, edge, newRoutingPoints));
         });

      }
      return compoundCommand;
   }
}
