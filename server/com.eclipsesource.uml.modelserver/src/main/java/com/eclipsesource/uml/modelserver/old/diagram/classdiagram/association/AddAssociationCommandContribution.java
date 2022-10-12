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
package com.eclipsesource.uml.modelserver.old.diagram.classdiagram.association;

public class AddAssociationCommandContribution { /*-{

   public static final String TYPE = "addAssociationContributuion";
   public static final String SOURCE_CLASS_URI_FRAGMENT = "sourceClassUriFragment";
   public static final String TARGET_CLASS_URI_FRAGMENT = "targetClassUriFragment";
   public static final String TYPE_KEYWORD = "typeKeyword";

   public static CCompoundCommand create(final String sourceClassUriFragment, final String targetClassUriFragment,
                                         final String keyword) {
      CCompoundCommand addAssociationCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addAssociationCommand.setType(TYPE);
      addAssociationCommand.getProperties().put(SOURCE_CLASS_URI_FRAGMENT, sourceClassUriFragment);
      addAssociationCommand.getProperties().put(TARGET_CLASS_URI_FRAGMENT, targetClassUriFragment);
      addAssociationCommand.getProperties().put(TYPE_KEYWORD, keyword);
      return addAssociationCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {

      String sourceClassUriFragment = command.getProperties().get(SOURCE_CLASS_URI_FRAGMENT);
      String targetClassUriFragment = command.getProperties().get(TARGET_CLASS_URI_FRAGMENT);

      String type = command.getProperties().get(TYPE_KEYWORD);

      return new AddAssociationCompoundCommand(domain, modelUri, sourceClassUriFragment, targetClassUriFragment, type);
   }
   */
}
