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

public class SetClassNameCommandContribution { /*-{

   public static final String TYPE = "setClassName";
   public static final String NEW_NAME = "newName";

   public static CCommand create(final String semanticUri, final String newName) {
      CCommand setClassNameCommand = CCommandFactory.eINSTANCE.createCommand();
      setClassNameCommand.setType(TYPE);
      setClassNameCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
      setClassNameCommand.getProperties().put(NEW_NAME, newName);
      return setClassNameCommand;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
      String newName = command.getProperties().get(NEW_NAME);

      return new SetClassNameCommand(domain, modelUri, semanticUriFragment, newName);
   }
   */
}
