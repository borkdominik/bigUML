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
package com.eclipsesource.uml.glsp.operations;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.Set;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicOperationHandler;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.operations.DeleteOperation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Comment;
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class UmlDeleteOperationHandler extends EMSBasicOperationHandler<DeleteOperation, UmlModelServerAccess> {

   @Inject
   private Set<UmlDiagramDeleteOperationHandler> deleteOperationHandlers;

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

   @Override
   public void executeOperation(final DeleteOperation operation, final UmlModelServerAccess modelAccess) {
      UmlModelState modelState = getUmlModelState();

      Representation diagramType = UmlModelState.getModelState(modelState).getNotationModel().getDiagramType();
      var deleteOperationHandler = deleteOperationHandlers.stream().filter(handler -> handler.supports(diagramType))
         .findFirst();

      operation.getElementIds().forEach(elementId -> {
         GModelElement gElem = modelState.getIndex().get(elementId).get();
         if (Types.COMMENT_EDGE.equals(gElem.getType())) {
            GEdge edge = (GEdge) gElem;
            Comment comment = getOrThrow(modelState.getIndex().getSemantic(edge.getSource()),
               Comment.class, "Could not find element for id '" + edge.getId() + "', no delete operation executed.");
            Element target = getOrThrow(modelState.getIndex().getSemantic(edge.getTarget()),
               Element.class, "Could not find element for id '" + edge.getId() + "', no delete operation executed.");
            modelAccess.unlinkComment(modelState, comment, target).thenAccept(response -> {
               if (!response.body()) {
                  throw new GLSPServerException(
                     "Could not execute unlink operation for Element: " + edge.getTargetId());
               }
            });
            return;
         }

         EObject semanticElement = getOrThrow(modelState.getIndex().getSemantic(elementId),
            EObject.class, "Could not find element for id '" + elementId + "', no delete operation executed.");

         if (semanticElement instanceof Comment) {
            modelAccess.removeComment(modelState, (Comment) semanticElement).thenAccept(response -> {
               if (!response.body()) {
                  throw new GLSPServerException(
                     "Could not execute delete operation on Activity: " + semanticElement.toString());
               }
            });
            return;
         }

         deleteOperationHandler
            .orElseThrow(() -> new GLSPServerException("No handler found for diagram " + diagramType))
            .delete(semanticElement, modelAccess);
      });
   }

}
