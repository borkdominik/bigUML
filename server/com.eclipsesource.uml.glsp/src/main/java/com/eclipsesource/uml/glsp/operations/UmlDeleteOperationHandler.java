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


import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicOperationHandler;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.operations.DeleteOperation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.*;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

public class UmlDeleteOperationHandler extends EMSBasicOperationHandler<DeleteOperation, UmlModelServerAccess> {

   protected UmlModelState getUmlModelState() {
      return (UmlModelState) getEMSModelState();
   }

   @Override
   public void executeOperation(final DeleteOperation operation, final UmlModelServerAccess modelAccess) {
      UmlModelState modelState = getUmlModelState();

      Representation diagramType = UmlModelState.getModelState(modelState).getNotationModel().getDiagramType();

      operation.getElementIds().forEach(elementId -> {

         boolean removeGuard = false;
         boolean removeWeight = false;
         boolean removeTransitionGuard = false;
         boolean removeTransitionEffect = false;
         boolean removeTransitionTrigger = false;

         if (elementId.endsWith(UmlIDUtil.PROPERTY_SUFFIX)) {
            elementId = UmlIDUtil.getElementIdFromProperty(elementId);
         } else if (elementId.startsWith("_weight")) {
            removeWeight = true;
            elementId = elementId.replace("_weight", "");
         } else if (elementId.startsWith("_guard")) {
            removeGuard = true;
            elementId = elementId.replace("_guard", "");
         } else if (elementId.startsWith(UmlIDUtil.LABEL_GUARD_SUFFIX)) {
            removeTransitionGuard = true;
            elementId = UmlIDUtil.getElementIdFromLabelGuard(elementId);
         } else if (elementId.startsWith(UmlIDUtil.LABEL_EFFECT_SUFFIX)) {
            removeTransitionEffect = true;
            elementId = UmlIDUtil.getElementIdFromLabelEffect(elementId);
         } else if (elementId.startsWith(UmlIDUtil.LABEL_TRIGGER_SUFFIX)) {
            removeTransitionTrigger = true;
            elementId = UmlIDUtil.getElementIdFromLabelTrigger(elementId);
         }


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

         // ACTIVITY
         if (diagramType == Representation.ACTIVITY) {
            if (semanticElement instanceof ActivityNode) {
               modelAccess.removeActivityNode(modelState, (ActivityNode) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                           "Could not execute delete operation on ActivityNode: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof ActivityEdge) {
               if (removeGuard) {
                  modelAccess.setGuard(modelState, (ControlFlow) semanticElement, "").thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException(
                              "Could not execute remove Guard operation on ActivityEdge: " + semanticElement.toString());
                     }
                  });
               } else if (removeWeight) {
                  modelAccess.setWeight(modelState, (ControlFlow) semanticElement, "").thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException(
                              "Could not execute remove Weight operation on ActivityEdge: " + semanticElement.toString());
                     }
                  });
               } else {
                  modelAccess.removeActivityEdge(modelState, (ActivityEdge) semanticElement).thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException(
                              "Could not execute delete operation on ActivityEdge: " + semanticElement.toString());
                     }
                  });
               }
            } else if (semanticElement instanceof Activity) {
               modelAccess.removeActivity(modelState, (Activity) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                           "Could not execute delete operation on Activity: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof ActivityGroup) {
               modelAccess.removeActivityGroup(modelState, (ActivityGroup) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                           "Could not execute delete operation on Activity: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof ExceptionHandler) {
               modelAccess.removeExceptionHandler(modelState, (ExceptionHandler) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                           "Could not execute delete operation on Activity: " + semanticElement.toString());
                  }
               });
            }
         } // STATE MACHINE DIAGRAM
         else if (diagramType == Representation.STATEMACHINE) {
            if (semanticElement instanceof FinalState) {
               modelAccess.removeFinalState(modelState, (FinalState) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                           "Could not execute delete operation on Pseudo State Node: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof StateMachine) {
               modelAccess.removeStateMachine(modelState, (StateMachine) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                           "Could not execute delete operation on State Machine Node: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof State) {
               modelAccess.removeState(modelState, (State) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                           "Could not execute delete operation on State Node: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Pseudostate) {
               modelAccess.removePseudostate(modelState, (Pseudostate) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                           "Could not execute delete operation on Pseudo State Node: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Behavior) {
               modelAccess.removeBehaviorFromState(modelState, (Behavior) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                           "Could not execute delete operation on Behavior: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Transition) {
               if (removeTransitionGuard) {
                  modelAccess.addTransitionGuard(modelState, (Transition) semanticElement, "")
                        .thenAccept(response -> {
                           if (!response.body()) {
                              throw new GLSPServerException(
                                    "Could not execute remove transition guard operation on Transition: "
                                          + semanticElement.toString());
                           }
                        });
               } else if (removeTransitionEffect) {
                  modelAccess.addTransitionEffect(modelState, (Transition) semanticElement, "")
                        .thenAccept(response -> {
                           if (!response.body()) {
                              throw new GLSPServerException(
                                    "Could not execute remove transition effect operation on Transition: "
                                          + semanticElement.toString());
                           }
                        });
               } else if (removeTransitionTrigger) {
                  modelAccess.addTransitionTrigger(modelState, (Transition) semanticElement, "")
                        .thenAccept(response -> {
                           if (!response.body()) {
                              throw new GLSPServerException(
                                    "Could not execute remove transition trigger operation on Transition: "
                                          + semanticElement.toString());
                           }
                        });
               } else {
                  modelAccess.removeTransition(modelState, (Transition) semanticElement).thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException(
                              "Could not execute delete operation on Transition: " + semanticElement.toString());
                     }
                  });
               }
            }
         } // DEPLOYMENT DIAGRAM
         else if (diagramType == Representation.DEPLOYMENT) {
            if (semanticElement instanceof DeploymentSpecification) {
               modelAccess.removeDeploymentSpecification(modelState, (DeploymentSpecification) semanticElement).thenAccept(
                     response -> {
                        if (!response.body()) {
                           throw new GLSPServerException(
                                 "Could not execute delete operation on Deployment Specification: " + semanticElement.toString());
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
               modelAccess.removeCommunicationPath(modelState, (CommunicationPath) semanticElement).thenAccept(response -> {
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
         } // USECASE DIAGRAM
         else if (diagramType == Representation.USECASE) {

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
         } // CLASS DIAGRAM
         else if (diagramType == Representation.CLASS || diagramType == Representation.OBJECT) {
            if (semanticElement instanceof Class) {
               modelAccess.removeClass(modelState, (Class) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                           "Could not execute delete operation on Class: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Interface) {
               modelAccess.removeInterface(modelState, (Interface) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                           "Could not execute delete operation on Interface: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Enumeration) {
               modelAccess.removeEnumeration(modelState, (Enumeration) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                           "Could not execute delete operation on Enumeration: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Property) {
               modelAccess.removeProperty(modelState, (Property) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                           "Could not execute delete operation on Property: " + semanticElement.toString());
                  }
               });
            } else if (semanticElement instanceof Association) {
               modelAccess.removeAssociation(modelState, (Association) semanticElement).thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException(
                           "Could not execute delete operation on Association: " + semanticElement.toString());
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
