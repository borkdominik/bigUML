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
package com.eclipsesource.uml.modelserver.commands.activitydiagram.comment;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.uml2.uml.Comment;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlSemanticCommandContribution;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class RemoveCommentCommandContribution extends UmlSemanticCommandContribution {

   public static final String TYPE = "removeComment";

   public static CCommand create(final Comment comment) {
      CCommand removePropertyCommand = CCommandFactory.eINSTANCE.createCommand();
      removePropertyCommand.setType(TYPE);
      removePropertyCommand.getProperties().put(SEMANTIC_URI_FRAGMENT,
         UmlSemanticCommandUtil.getSemanticUriFragment(comment));
      return removePropertyCommand;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      String semanticUri = command.getProperties().get(SEMANTIC_URI_FRAGMENT);

      return new RemoveCommentCompoundCommand(domain, modelUri, semanticUri);
   }

}
