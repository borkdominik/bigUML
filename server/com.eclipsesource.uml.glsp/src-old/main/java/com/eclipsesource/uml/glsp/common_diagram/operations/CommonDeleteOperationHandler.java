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
package com.eclipsesource.uml.glsp.uml.diagram.common_diagram.operations;

public class CommonDeleteOperationHandler { /*- implements DiagramDeleteHandler {
   @Inject
   private UmlModelState modelState;

   @Inject
   private UmlModelServerAccess modelServerAccess;

   @Override
   public boolean supports(final Representation representation) {
      return true;
   }

   @Override
   public void executeDeletion(final EObject semanticElement) {
      // TODO: activate this
      /*-
      GModelElement gElem = modelState.getIndex().get(semanticElement).get();
      if (Types.COMMENT_EDGE.equals(gElem.getType())) {
         GEdge edge = (GEdge) gElem;
         Comment comment = getOrThrow(modelState.getIndex().getEObject(edge.getSource()),
            Comment.class, "Could not find element for id '" + edge.getId() + "', no delete operation executed.");
         Element target = getOrThrow(modelState.getIndex().getEObject(edge.getTarget()),
            Element.class, "Could not find element for id '" + edge.getId() + "', no delete operation executed.");
         modelAccess.unlinkComment(modelState, comment, target).thenAccept(response -> {
            if (response.body() == null || response.body().isEmpty()) {
               throw new GLSPServerException(
                  "Could not execute unlink operation for Element: " + edge.getTargetId());
            }
         });
         return;
      }

      if (semanticElement instanceof Comment) {
         modelServerAccess.exec(RemoveCommentCommandContribution
            .create((Comment) semanticElement)).thenAccept(response -> {
               if (response.body() == null || response.body().isEmpty()) {
                  throw new GLSPServerException(
                     "Could not execute delete operation on comment: " + semanticElement.toString());
               }
            });
         return;
      }
      *
   }
   */
}
