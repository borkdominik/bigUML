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
package com.eclipsesource.uml.modelserver.old.diagram.classdiagram.property;

public class AddPropertyCommandContribution { /*-{

   public static final String TYPE = "addProperty";

   public static CCommand create(final String parentSemanticUri) {
      CCommand addPropertyCommand = CCommandFactory.eINSTANCE.createCommand();
      addPropertyCommand.setType(TYPE);
      addPropertyCommand.getProperties().put(PARENT_SEMANTIC_URI_FRAGMENT, parentSemanticUri);
      return addPropertyCommand;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      String parentSemanticUriFragment = command.getProperties().get(PARENT_SEMANTIC_URI_FRAGMENT);
      return new AddPropertyCommand(domain, modelUri, parentSemanticUriFragment);
   }
   */
}
