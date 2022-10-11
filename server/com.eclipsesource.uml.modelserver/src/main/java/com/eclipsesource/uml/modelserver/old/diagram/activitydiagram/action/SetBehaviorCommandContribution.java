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
package com.eclipsesource.uml.modelserver.old.diagram.activitydiagram.action;

public class SetBehaviorCommandContribution { /*-

   public static final String TYPE = "setBehavior";
   public static final String BEHAVOIOR_NAME = "behaviorName";

   public static CCommand create(final String semanticUri, final String behaviorName) {
      CCommand setClassNameCommand = CCommandFactory.eINSTANCE.createCommand();
      setClassNameCommand.setType(TYPE);
      setClassNameCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
      setClassNameCommand.getProperties().put(BEHAVOIOR_NAME, behaviorName);
      return setClassNameCommand;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
      String behaviorName = command.getProperties().get(BEHAVOIOR_NAME);

      return new SetBehaviorCommand(domain, modelUri, semanticUriFragment, behaviorName);
   }
   */
}
