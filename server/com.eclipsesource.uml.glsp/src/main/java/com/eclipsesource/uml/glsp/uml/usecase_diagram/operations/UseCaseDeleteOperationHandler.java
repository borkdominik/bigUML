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
package com.eclipsesource.uml.glsp.uml.usecase_diagram.operations;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicOperationHandler;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.operations.DeleteOperation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Actor;
import org.eclipse.uml2.uml.Comment;
import org.eclipse.uml2.uml.Component;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Extend;
import org.eclipse.uml2.uml.ExtensionPoint;
import org.eclipse.uml2.uml.Generalization;
import org.eclipse.uml2.uml.Include;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.UseCase;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.usecase_diagram.UseCaseModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class UseCaseDeleteOperationHandler extends EMSBasicOperationHandler<DeleteOperation, UseCaseModelServerAccess> {

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

   @Override
   public void executeOperation(final DeleteOperation operation, final UseCaseModelServerAccess modelAccess) {
      UmlModelState modelState = getUmlModelState();

      Representation diagramType = UmlModelState.getModelState(modelState).getNotationModel().getDiagramType();

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

         if (diagramType == Representation.USECASE) {

            if (semanticElement instanceof Actor) {
               modelAccess.removeActor(modelState, (Actor) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on UseCase: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof UseCase) {
               modelAccess.removeUseCase(modelState, (UseCase) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on UseCase: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Component) {
               modelAccess.removeComponent(modelState, (Component) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on UseCase: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof ExtensionPoint) {
               modelAccess.removeExtensionPoint(modelState, (ExtensionPoint) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on ExtensionPoint: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Package) {
               modelAccess.removePackage(modelState, (Package) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Package: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Extend) {
               modelAccess.removeExtend(modelState, (Extend) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Extend: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Include) {
               modelAccess.removeInclude(modelState, (Include) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Include: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Generalization) {
               modelAccess.removeGeneralization(modelState, (Generalization) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Generalization: " + semanticElement.toString());
                  }
               });
            }
         } else if (semanticElement instanceof Comment) {
            modelAccess.removeComment(modelState, (Comment) semanticElement).thenAccept(response -> {
               if (!response.body()) {
                  throw new GLSPServerException(
                     "Could not execute delete operation on Activity: " + semanticElement.toString());
               }
            });
         }
      });
   }

}
