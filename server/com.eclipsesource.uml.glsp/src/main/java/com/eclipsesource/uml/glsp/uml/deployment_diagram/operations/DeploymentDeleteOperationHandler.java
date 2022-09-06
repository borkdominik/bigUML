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
package com.eclipsesource.uml.glsp.uml.deployment_diagram.operations;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicOperationHandler;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.operations.DeleteOperation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.Comment;
import org.eclipse.uml2.uml.CommunicationPath;
import org.eclipse.uml2.uml.Deployment;
import org.eclipse.uml2.uml.DeploymentSpecification;
import org.eclipse.uml2.uml.Device;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.ExecutionEnvironment;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.Node;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.deployment_diagram.DeploymentModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class DeploymentDeleteOperationHandler
   extends EMSBasicOperationHandler<DeleteOperation, DeploymentModelServerAccess> {

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

   @Override
   public void executeOperation(final DeleteOperation operation, final DeploymentModelServerAccess modelAccess) {
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

         // DEPLOYMENT DIAGRAM
         if (diagramType == Representation.DEPLOYMENT) {
            if (semanticElement instanceof DeploymentSpecification) {
               modelAccess.removeDeploymentSpecification(modelState, (DeploymentSpecification) semanticElement)
                  .thenAccept(
                     response -> {
                        if (!response.body()) {
                           throw new GLSPServerException(
                              "Could not execute delete operation on Deployment Specification: "
                                 + semanticElement.toString());
                        }
                     });
            } else if (semanticElement instanceof Artifact) {
               modelAccess.removeArtifact(modelState, (Artifact) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Artifact Node: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof ExecutionEnvironment) {
               modelAccess.removeExecutionEnvironment(modelState, (ExecutionEnvironment) semanticElement)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException(
                           "Could not execute delete operation on Property: " + semanticElement.toString());
                     }
                  });
            } else if (semanticElement instanceof Device) {
               modelAccess.removeDevice(modelState, (Device) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Deployment Node: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Node) {
               modelAccess.removeNode(modelState, (Node) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Deployment Node: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof CommunicationPath) {
               modelAccess.removeCommunicationPath(modelState, (CommunicationPath) semanticElement)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException(
                           "Could not execute delete operation on Communication Path: " + semanticElement.toString());
                     }
                  });
            } else if (semanticElement instanceof Deployment) {
               NamedElement source = ((Deployment) semanticElement).getClients().get(0);
               modelAccess.removeDeployment(modelState, (Deployment) semanticElement, source).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                        "Could not execute delete operation on Communication Path: " + semanticElement.toString());
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
