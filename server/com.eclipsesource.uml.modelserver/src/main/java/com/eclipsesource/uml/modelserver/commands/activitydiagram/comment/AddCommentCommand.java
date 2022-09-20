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

import java.util.function.Supplier;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.ActivityContent;
import org.eclipse.uml2.uml.ActivityEdge;
import org.eclipse.uml2.uml.Comment;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class AddCommentCommand extends UmlSemanticElementCommand implements Supplier<Comment> {

   private final Element object;
   private Comment comment;

   public AddCommentCommand(final EditingDomain domain, final URI modelUri, final String parentUri) {
      super(domain, modelUri);
      object = UmlSemanticCommandUtil.getElement(umlModel, parentUri, Element.class);

   }

   @Override
   protected void doExecute() {
      if (object instanceof ActivityContent) {
         Activity activity = ((ActivityContent) object).containingActivity();
         comment = activity.createOwnedComment();
         if (object instanceof NamedElement && !(object instanceof ActivityEdge)) {
            comment.setBody("Comment for " + ((NamedElement) object).getName());
         }
         comment.setBody("NewComment");
      } else if (object instanceof Activity) {
         Model model = object.getModel();
         comment = model.createOwnedComment();
         comment.setBody(((Activity) object).getName());
      } else if (object instanceof Model) {
         comment = object.createOwnedComment();
         comment.setBody("New Comment");
      } else {
         throw new RuntimeException("Invalid element type to create a comment: " + object.getClass().getSimpleName());
      }

      comment.getAnnotatedElements().add(object);
   }

   @Override
   public Comment get() {
      return comment;
   }

}
