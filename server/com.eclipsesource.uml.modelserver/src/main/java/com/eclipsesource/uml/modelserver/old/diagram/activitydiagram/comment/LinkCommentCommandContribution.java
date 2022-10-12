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
package com.eclipsesource.uml.modelserver.old.diagram.activitydiagram.comment;

public class LinkCommentCommandContribution { /*-

   public static final String TYPE = "linkComment";
   public static final String COMMENT_URI = "commentUri";
   public static final String ELEMENT_URI = "elementUri";

   public static CCommand create(final Comment comment, final Element target) {
      CCommand setClassNameCommand = CCommandFactory.eINSTANCE.createCommand();
      setClassNameCommand.setType(TYPE);
      setClassNameCommand.getProperties().put(COMMENT_URI, UmlSemanticCommandUtil.getSemanticUriFragment(comment));
      setClassNameCommand.getProperties().put(ELEMENT_URI, UmlSemanticCommandUtil.getSemanticUriFragment(target));
      return setClassNameCommand;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      String commentUri = command.getProperties().get(COMMENT_URI);
      String elementUri = command.getProperties().get(ELEMENT_URI);

      return new LinkCommentCommand(domain, modelUri, commentUri, elementUri);
   }
   */
}
