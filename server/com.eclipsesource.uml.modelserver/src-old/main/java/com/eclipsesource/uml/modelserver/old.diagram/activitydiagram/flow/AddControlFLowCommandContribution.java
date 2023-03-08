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
package com.eclipsesource.uml.modelserver.old.diagram.activitydiagram.flow;

public class AddControlFLowCommandContribution { /*-

   public static final String TYPE = "addControlflowContributuion";
   private static final String SOURCE_URI = "sourceUri";
   private static final String TARGET_URI = "targetUri";

   public static CCompoundCommand create(final String sourceUri, final String targetUri) {
      CCompoundCommand addActivityCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addActivityCommand.setType(TYPE);

      addActivityCommand.getProperties().put(SOURCE_URI, sourceUri);
      addActivityCommand.getProperties().put(TARGET_URI, targetUri);
      return addActivityCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      String sourceUri = command.getProperties().get(SOURCE_URI);
      String targetUri = command.getProperties().get(TARGET_URI);

      return new AddControlFlowCompoundCommand(domain, modelUri, sourceUri, targetUri);
   }
   */
}
