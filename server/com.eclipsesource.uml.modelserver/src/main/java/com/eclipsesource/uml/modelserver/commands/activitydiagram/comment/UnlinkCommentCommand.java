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

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Comment;
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class UnlinkCommentCommand extends UmlSemanticElementCommand {

   protected Comment comment;
   protected Element element;

   public UnlinkCommentCommand(final EditingDomain domain, final URI modelUri, final String commentUri,
      final String elementUri) {
      super(domain, modelUri);
      comment = UmlSemanticCommandUtil.getElement(umlModel, commentUri, Comment.class);
      element = UmlSemanticCommandUtil.getElement(umlModel, elementUri, Element.class);
   }

   @Override
   protected void doExecute() {
      if (comment.getAnnotatedElements().contains(element)) {
         comment.getAnnotatedElements().remove(element);
      }
   }

}
