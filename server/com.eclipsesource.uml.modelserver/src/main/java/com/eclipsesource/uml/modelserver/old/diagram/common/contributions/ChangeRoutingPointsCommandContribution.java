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
package com.eclipsesource.uml.modelserver.old.diagram.common.contributions;

public class ChangeRoutingPointsCommandContribution {
   /*-
   public static final String TYPE = "changeRoutingPoints";
   
   public static CCommand create(final String semanticUri, final List<GPoint> routingPoints) {
      CCompoundCommand changeRoutingPointsCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      changeRoutingPointsCommand.setType(TYPE);
      changeRoutingPointsCommand.getProperties().put(SEMANTIC_PROXI_URI, semanticUri);
   
      routingPoints.forEach(point -> {
         CCommand childCommand = CCommandFactory.eINSTANCE.createCommand();
         childCommand.getProperties().put(POSITION_X, String.valueOf(point.getX()));
         childCommand.getProperties().put(POSITION_Y, String.valueOf(point.getY()));
         changeRoutingPointsCommand.getCommands().add(childCommand);
      });
   
      return changeRoutingPointsCommand;
   }
   
   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
   
      CompoundCommand compoundCommand = new CompoundCommand();
   
      if (command instanceof CCompoundCommand) {
   
         ((CCompoundCommand) command).getCommands().forEach(changeRoutingPointCommand -> {
            String semanticProxyUri = changeRoutingPointCommand.getProperties().get(SEMANTIC_PROXI_URI);
            List<GPoint> newRoutingPoints = new ArrayList<>();
            ((CCompoundCommand) changeRoutingPointCommand).getCommands().forEach(cmd -> {
               GPoint routingPoint = UmlNotationCommandUtil.getGPoint(
                  cmd.getProperties().get(POSITION_X), cmd.getProperties().get(POSITION_Y));
               newRoutingPoints.add(routingPoint);
            });
            compoundCommand.append(
               new ChangeRoutingPointsCommand(domain, modelUri, semanticProxyUri, newRoutingPoints));
         });
   
      }
      return compoundCommand;
   }
   */
}
