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
package com.eclipsesource.uml.modelserver.commands.activitydiagram.flow;

public class SetWeightCommandContribution { /*-

   public static final String TYPE = "setWeight";
   public static final String NEW_VALUE = "newValue";

   public static CCommand create(final String semanticUri, final String newValue) {
      CCommand setGuardCommand = CCommandFactory.eINSTANCE.createCommand();
      setGuardCommand.setType(TYPE);
      setGuardCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
      setGuardCommand.getProperties().put(NEW_VALUE, newValue);
      return setGuardCommand;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
      String newValue = command.getProperties().get(NEW_VALUE);

      return new SetWeightCommand(domain, modelUri, semanticUriFragment, newValue);
   }
   */
}
