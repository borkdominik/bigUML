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
package com.eclipsesource.uml.modelserver.commands.statemachinediagram.statemachine;

public class RemoveStateMachineCommandContribution { /*-{

   public static final String TYPE = "removeStateMachine";

   public static CCompoundCommand create(final String semanticUri) {
      CCompoundCommand removeStateMachineCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      removeStateMachineCommand.setType(TYPE);
      removeStateMachineCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
      return removeStateMachineCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
      return new RemoveStateMachineCompoundCommand(domain, modelUri, semanticUriFragment);
   }
   */
}
