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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property;

public class RemovePropertyContribution { /*-{

   public static final String TYPE = "removeProperty";

   public static CCommand create(final String parentSemanticUri, final String semanticUri) {
      CCommand removePropertyCommand = CCommandFactory.eINSTANCE.createCommand();
      removePropertyCommand.setType(TYPE);
      removePropertyCommand.getProperties().put(PARENT_SEMANTIC_URI_FRAGMENT, parentSemanticUri);
      removePropertyCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
      return removePropertyCommand;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      String parentSemanticUri = command.getProperties().get(PARENT_SEMANTIC_URI_FRAGMENT);
      String semanticUri = command.getProperties().get(SEMANTIC_URI_FRAGMENT);

      return new RemovePropertyCommand(domain, modelUri, parentSemanticUri, semanticUri);
   }
   */
}
