/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.old.diagram.classdiagram.property;

public class SetPropertyBoundsCommandContribution { /*-{

   public static final String TYPE = "setPropertyBounds";
   public static final String NEW_BOUNDS = "newBounds";

   public static CCommand create(final String semanticUri, final String newBounds) {
      CCommand setPropertyCommand = CCommandFactory.eINSTANCE.createCommand();
      setPropertyCommand.setType(TYPE);
      setPropertyCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
      setPropertyCommand.getProperties().put(NEW_BOUNDS, newBounds);
      return setPropertyCommand;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {

      String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
      int newLowerBound = UmlSemanticCommandUtil.getLower(command.getProperties().get(NEW_BOUNDS));
      int newUpperBound = UmlSemanticCommandUtil.getUpper(command.getProperties().get(NEW_BOUNDS));

      return new SetPropertyBoundsCommand(domain, modelUri, semanticUriFragment, newLowerBound, newUpperBound);
   }
   */
}
