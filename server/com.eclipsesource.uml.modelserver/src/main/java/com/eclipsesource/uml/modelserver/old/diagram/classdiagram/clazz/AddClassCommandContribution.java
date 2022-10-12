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
package com.eclipsesource.uml.modelserver.old.diagram.classdiagram.clazz;

public class AddClassCommandContribution { /*-{

   public static final String TYPE = "addClassContributuion";
   public static final String CLASS_TYPE = "classType";

   public static CCompoundCommand create(final GPoint position, final Boolean isAbstract) {
      CCompoundCommand addClassCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addClassCommand.setType(TYPE);
      addClassCommand.getProperties().put(NotationKeys.POSITION_X, String.valueOf(position.getX()));
      addClassCommand.getProperties().put(NotationKeys.POSITION_Y, String.valueOf(position.getY()));
      addClassCommand.getProperties().put(CLASS_TYPE, isAbstract.toString());
      return addClassCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {

      GPoint classPosition = UmlNotationCommandUtil.getGPoint(
            command.getProperties().get(NotationKeys.POSITION_X),
            command.getProperties().get(NotationKeys.POSITION_Y));

      Boolean isAbstract = Boolean.parseBoolean(command.getProperties().get(CLASS_TYPE));

      return new AddClassCompoundCommand(domain, modelUri, classPosition, isAbstract);
   }
   */
}
