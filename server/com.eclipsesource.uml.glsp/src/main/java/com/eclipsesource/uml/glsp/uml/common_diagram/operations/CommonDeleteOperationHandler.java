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
package com.eclipsesource.uml.glsp.uml.common_diagram.operations;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Comment;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.operations.DiagramDeleteOperationHandler;
import com.eclipsesource.uml.modelserver.commands.activitydiagram.comment.RemoveCommentCommandContribution;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class CommonDeleteOperationHandler implements DiagramDeleteOperationHandler {
   @Inject
   private UmlModelState modelState;

   @Override
   public boolean supports(final Representation representation) {
      return true;
   }

   @Override
   public void delete(final EObject semanticElement, final UmlModelServerAccess modelAccess) {
      // TODO: activate this
      /*
       * GModelElement gElem = modelState.getIndex().get(semanticElement).get();
       * if (Types.COMMENT_EDGE.equals(gElem.getType())) {
       * GEdge edge = (GEdge) gElem;
       * Comment comment = getOrThrow(modelState.getIndex().getSemantic(edge.getSource()),
       * Comment.class, "Could not find element for id '" + edge.getId() + "', no delete operation executed.");
       * Element target = getOrThrow(modelState.getIndex().getSemantic(edge.getTarget()),
       * Element.class, "Could not find element for id '" + edge.getId() + "', no delete operation executed.");
       * modelAccess.unlinkComment(modelState, comment, target).thenAccept(response -> {
       * if (!response.body()) {
       * throw new GLSPServerException(
       * "Could not execute unlink operation for Element: " + edge.getTargetId());
       * }
       * });
       * return;
       * }
       */

      if (semanticElement instanceof Comment) {
         modelAccess.exec(RemoveCommentCommandContribution
            .create((Comment) semanticElement)).thenAccept(response -> {
               if (!response.body()) {
                  throw new GLSPServerException(
                     "Could not execute delete operation on comment: " + semanticElement.toString());
               }
            });
         return;
      }

   }

}
