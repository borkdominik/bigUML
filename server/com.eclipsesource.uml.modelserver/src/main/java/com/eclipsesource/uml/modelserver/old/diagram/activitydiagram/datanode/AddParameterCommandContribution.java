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
package com.eclipsesource.uml.modelserver.old.diagram.activitydiagram.datanode;

public class AddParameterCommandContribution { /*-

   public static final String TYPE = "addParameter";
   private static final String PARENT_URI = "parentUri";

   public static CCompoundCommand create(final GPoint position, final String activityUri) {
      CCompoundCommand addPartitionCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addPartitionCommand.setType(TYPE);
      addPartitionCommand.getProperties().put(NotationKeys.POSITION_X,
            String.valueOf(position.getX()));
      addPartitionCommand.getProperties().put(NotationKeys.POSITION_Y,
            String.valueOf(position.getY()));
      addPartitionCommand.getProperties().put(PARENT_URI, activityUri);
      return addPartitionCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {

      GPoint parameterPosition = UmlNotationCommandUtil.getGPoint(
            command.getProperties().get(NotationKeys.POSITION_X),
            command.getProperties().get(NotationKeys.POSITION_Y));

      final String activityUri = command.getProperties().get(PARENT_URI);
      return new AddParameterCompoundCommand(domain, modelUri, parameterPosition, activityUri);
   }
   */
}
