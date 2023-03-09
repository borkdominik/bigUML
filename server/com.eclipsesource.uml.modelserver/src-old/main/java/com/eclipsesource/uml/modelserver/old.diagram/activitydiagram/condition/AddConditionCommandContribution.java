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
package com.eclipsesource.uml.modelserver.old.diagram.activitydiagram.condition;

public class AddConditionCommandContribution { /*-

   public static final String TYPE = "addConditionContributuion";
   private static final String PARENT_URI = "parentUri";
   private static final String PRECONDITION = "precondition";

   public static CCompoundCommand create(final String parentUri, final boolean precondition) {
      CCompoundCommand addActivityCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addActivityCommand.setType(TYPE);
      addActivityCommand.getProperties().put(PARENT_URI, parentUri);
      addActivityCommand.getProperties().put(PRECONDITION, precondition + "");
      return addActivityCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      String parentUri = command.getProperties().get(PARENT_URI);
      boolean precondition = command.getProperties().get(PRECONDITION).equals("true");

      CompoundCommand cmd = new CompoundCommand();
      AddConditionCommand semanticCmd = new AddConditionCommand(domain, modelUri, parentUri, precondition);
      cmd.append(semanticCmd);
      return cmd;
   }
   */
}
