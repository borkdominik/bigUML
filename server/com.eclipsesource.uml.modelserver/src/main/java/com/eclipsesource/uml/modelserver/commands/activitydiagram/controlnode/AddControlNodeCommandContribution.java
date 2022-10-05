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
package com.eclipsesource.uml.modelserver.commands.activitydiagram.controlnode;

public class AddControlNodeCommandContribution { /*-

   public static final String TYPE = "addControlNodeContributuion";
   private static final String PARENT_URI = "parentUri";
   private static final String NODE_TYPE = "nodeType";

   public static CCompoundCommand create(final GPoint position, final String parentUri,
      final Class<? extends ControlNode> clazz) {
      CCompoundCommand addActivityCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addActivityCommand.setType(TYPE);
      addActivityCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X,
         String.valueOf(position.getX()));
      addActivityCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y,
         String.valueOf(position.getY()));
      addActivityCommand.getProperties().put(PARENT_URI, parentUri);
      addActivityCommand.getProperties().put(NODE_TYPE, clazz.getName());
      return addActivityCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      GPoint position = UmlNotationCommandUtil.getGPoint(
         command.getProperties().get(UmlNotationCommandContribution.POSITION_X),
         command.getProperties().get(UmlNotationCommandContribution.POSITION_Y));

      String parentUri = command.getProperties().get(PARENT_URI);
      String type = command.getProperties().get(NODE_TYPE);

      return new AddControlNodeCompoundCommand(domain, modelUri, position, parentUri, type);
   }
   */
}
