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
package com.eclipsesource.uml.modelserver.old.diagram.activitydiagram.partition;

public class AddPartitionCommandContribution { /*-

   public static final String TYPE = "addPartitionContributuion";
   private static final String PARENT_URI = "parentUri";

   public static CCompoundCommand create(final GPoint position, final String parentUri) {
      CCompoundCommand addPartitionCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addPartitionCommand.setType(TYPE);
      addPartitionCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X,
         String.valueOf(position.getX()));
      addPartitionCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y,
         String.valueOf(position.getY()));
      addPartitionCommand.getProperties().put(PARENT_URI, parentUri);
      return addPartitionCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      GPoint position = UmlNotationCommandUtil.getGPoint(
         command.getProperties().get(UmlNotationCommandContribution.POSITION_X),
         command.getProperties().get(UmlNotationCommandContribution.POSITION_Y));

      final String parentUri = command.getProperties().get(PARENT_URI);
      return new AddPartitionCompoundCommand(domain, modelUri, position, parentUri);
   }
   */
}
