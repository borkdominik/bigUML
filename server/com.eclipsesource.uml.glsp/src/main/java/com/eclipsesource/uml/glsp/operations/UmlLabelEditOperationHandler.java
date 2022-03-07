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

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicOperationHandler;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.features.directediting.ApplyLabelEditOperation;
import org.eclipse.glsp.server.model.GModelState;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.*;

import com.eclipsesource.uml.glsp.model.UmlModelIndex;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Package;

public class UmlLabelEditOperationHandler extends EMSBasicOperationHandler<ApplyLabelEditOperation, UmlModelServerAccess> {

    protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

    @Override
    public void executeOperation(final ApplyLabelEditOperation editLabelOperation, final UmlModelServerAccess modelAccess) {
        UmlModelState modelState = getUmlModelState();
        UmlModelIndex modelIndex = modelState.getIndex();

        String inputText = editLabelOperation.getText().trim();
        String graphicalElementId = editLabelOperation.getLabelId();

        GModelElement label = getOrThrow(modelIndex.findElementByClass(graphicalElementId, GModelElement.class),
         GModelElement.class, "Element not found.");

        switch (label.getType()) {
         case Types.CALL_REF: {

            CallBehaviorAction cba = getOrThrow(
               modelIndex.getSemantic(UmlIDUtil.getElementIdFromHeaderLabel(graphicalElementId)),
               CallBehaviorAction.class, "No valid container with id " + graphicalElementId + " found");
            modelAccess.setBehavior(modelState, cba, inputText)
               .thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException("Could not change Property to: " + inputText);
                  }
               });
            break;
         }

         case Types.LABEL_NAME:
            String containerElementId = UmlIDUtil.getElementIdFromHeaderLabel(graphicalElementId);
            Element semanticElement = getOrThrow(modelIndex.getSemantic(containerElementId),
               Element.class, "No valid container with id " + graphicalElementId + " found");

            if (semanticElement instanceof Comment) {
               modelAccess.setCommentBody(modelState, (Comment) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not change Property to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof Constraint) {
               modelAccess.setConditionBody(modelState, (Constraint) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not change Property to: " + inputText);
                     }
                  });
            } else if (semanticElement instanceof Package) {
               modelAccess.setPackageName(modelState, (Package) semanticElement, inputText)
                       .thenAccept(response -> {
                          if (!response.body()) {
                             throw new GLSPServerException("Could not rename Package to: " + inputText);
                          }
                       });
            } else if (semanticElement instanceof Actor) {
               modelAccess.setActorName(modelState, (Actor) semanticElement, inputText)
                       .thenAccept(response -> {
                          if (!response.body()) {
                             throw new GLSPServerException("Could not rename Actor to: " + inputText);
                          }
                       });
            } else if (semanticElement instanceof UseCase) {
               modelAccess.setUseCaseName(modelState, (UseCase) semanticElement, inputText)
                       .thenAccept(response -> {
                          if (!response.body()) {
                             throw new GLSPServerException("Could not rename UseCase to: " + inputText);
                          }
                       });
            } else if (semanticElement instanceof DeploymentSpecification) {
                modelAccess.setDeploymentSpecificationName(modelState, (DeploymentSpecification) semanticElement, inputText)
                        .thenAccept(response -> {
                            if (!response.body()) {
                                throw new GLSPServerException("Could not rename Deployment Specification to: " + inputText);
                            }
                        });
            } else if (semanticElement instanceof Artifact) {
               modelAccess.setArtifactName(modelState, (Artifact) semanticElement, inputText)
                       .thenAccept(response -> {
                          if (!response.body()) {
                             throw new GLSPServerException("Could not rename Artifact to: " + inputText);
                          }
                       });
            } else if (semanticElement instanceof Device) {
                modelAccess.setDeviceName(modelState, (Device) semanticElement, inputText)
                        .thenAccept(response -> {
                            if (!response.body()) {
                                throw new GLSPServerException("Could not rename Device to: " + inputText);
                            }
                        });
            } else if (semanticElement instanceof ExecutionEnvironment) {
                modelAccess.setExecutionEnvironmentName(modelState, (ExecutionEnvironment) semanticElement, inputText)
                        .thenAccept(response -> {
                            if (!response.body()) {
                                throw new GLSPServerException("Could not rename Execution Environment to: " + inputText);
                            }
                        });
            } else if (semanticElement instanceof CommunicationPath) {
                modelAccess.setCommunicationPathEndName(modelState, (CommunicationPath) semanticElement, inputText)
                        .thenAccept(response -> {
                            if (!response.body()) {
                                throw new GLSPServerException("Could not rename Communication Path to: " + inputText);
                            }
                        });
            } else if (semanticElement instanceof Node) {
               modelAccess.setNodeName(modelState, (Node) semanticElement, inputText)
                       .thenAccept(response -> {
                          if (!response.body()) {
                             throw new GLSPServerException("Could not rename UseCase to: " + inputText);
                          }
                       });
            } else if (semanticElement instanceof StateMachine) {
                modelAccess.setStateMachineName(modelState, (StateMachine) semanticElement, inputText)
                        .thenAccept(response -> {
                            if (!response.body()) {
                                throw new GLSPServerException("Could not rename State Machine to: " + inputText);
                            }
                        });
            } else if (semanticElement instanceof State) {
                modelAccess.setStateName(modelState, (State) semanticElement, inputText)
                        .thenAccept(response -> {
                            if (!response.body()) {
                                throw new GLSPServerException("Could not rename State to: " + inputText);
                            }
                        });
            } else if (semanticElement instanceof Pseudostate) {
                modelAccess.setPseudostateName(modelState, (Pseudostate) semanticElement, inputText)
                        .thenAccept(response -> {
                            if (!response.body()) {
                                throw new GLSPServerException("Could not rename Pseudo State to: " + inputText);
                            }
                        });
            } else if (semanticElement instanceof Class) {
               modelAccess.setClassName(modelState, (Class) semanticElement, inputText)
                       .thenAccept(response -> {
                          if (!response.body()) {
                             throw new GLSPServerException("Could not rename Class to: " + inputText);
                          }
                       });
            } else if (semanticElement instanceof InstanceSpecification) {
                modelAccess.setObjectName(modelState, (InstanceSpecification) semanticElement, inputText)
                        .thenAccept(response -> {
                            if (!response.body()) {
                                throw new GLSPServerException("Could not rename Object to: " + inputText);
                            }
                        });
            } else if (semanticElement instanceof NamedElement) {
               modelAccess.renameElement(modelState, (NamedElement) semanticElement, inputText)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not change Property to: " + inputText);
                     }
                  });
            }
            break;

         case Types.PROPERTY:
            Property classProperty = getOrThrow(modelIndex.getSemantic(graphicalElementId),
               Property.class, "No valid container with id " + graphicalElementId + " found");

            String propertyName = getNameFromInput(inputText);
            String propertyType = getTypeFromInput(inputText);
            String propertyBounds = getBoundsFromInput(inputText);

            modelAccess.setProperty(modelState, classProperty, propertyName, propertyType, propertyBounds)
               .thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException("Could not change Property to: " + inputText);
                  }
               });

            break;

          case Types.ATTRIBUTE:
              Property objectAttribute = getOrThrow(modelIndex.getSemantic(graphicalElementId),
                      Property.class, "No valid container with id " + graphicalElementId + " found");

              String attributeName = getNameFromInput(inputText);
              String attributeType = getTypeFromInput(inputText);
              String attributeBounds = getBoundsFromInput(inputText);

              modelAccess.setAttribute(modelState, objectAttribute, attributeName, attributeType, attributeBounds)
                      .thenAccept(response -> {
                          if (!response.body()) {
                              throw new GLSPServerException("Could not change Attribute to: " + inputText);
                          }
                      });

              break;

         case Types.EXTENSIONPOINT:
            ExtensionPoint ep = getOrThrow(modelIndex.getSemantic(graphicalElementId),
                    ExtensionPoint.class, "No valid container with id " + graphicalElementId + " found");

            modelAccess.setExtensionPointName(modelState, ep, inputText)
                    .thenAccept(response -> {
                       if (!response.body()) {
                          throw new GLSPServerException("Could not change ExtensionPoint Name to: " + inputText);
                       }
                    });

            break;

         case Types.LABEL_EDGE_NAME:
            containerElementId = UmlIDUtil.getElementIdFromLabelName(graphicalElementId);
            Property associationEnd = getOrThrow(modelIndex.getSemantic(containerElementId),
               Property.class, "No valid container with id " + graphicalElementId + " found");

            modelAccess.setAssociationEndName(modelState, associationEnd, inputText)
               .thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException("Could not change Association End Name to: " + inputText);
                  }
               });
            break;

         case Types.LABEL_EDGE_MULTIPLICITY:
            containerElementId = UmlIDUtil.getElementIdFromLabelMultiplicity(graphicalElementId);
            associationEnd = getOrThrow(modelIndex.getSemantic(containerElementId),
               Property.class, "No valid container with id " + graphicalElementId + " found");

            modelAccess.setAssociationEndMultiplicity(modelState, associationEnd, getBoundsFromInput(inputText))
               .thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException("Could not change Association End Name to: " + inputText);
                  }
               });
            break;

         case Types.LABEL_GUARD:
            containerElementId = UmlIDUtil.getEdgeIdFromGuardLabel(graphicalElementId);
            ControlFlow flow = getOrThrow(modelIndex.getSemantic(containerElementId),
               ControlFlow.class, "No valid controlFlow with id " + containerElementId + " found");
            modelAccess.setGuard(modelState, flow, inputText);
            break;

         case Types.LABEL_WEIGHT:
            containerElementId = UmlIDUtil.getEdgeFromWeightLabel(graphicalElementId);
            flow = getOrThrow(modelIndex.getSemantic(containerElementId),
               ControlFlow.class, "No valid controlFlow with id " + containerElementId + " found");
            modelAccess.setWeight(modelState, flow, inputText);
            break;

        case Types.STATE_ENTRY_ACTIVITY:
        containerElementId = UmlIDUtil.getElementIdFromHeaderLabel(graphicalElementId);
        Behavior behavior = getOrThrow(modelIndex.getSemantic(containerElementId),
              Behavior.class, "No valid container with id " + graphicalElementId + " found");

        modelAccess.setBehaviorInState(modelState, behavior, Types.STATE_ENTRY_ACTIVITY, inputText)
              .thenAccept(response -> {
                  if (!response.body()) {
                      throw new GLSPServerException("Could not change Behavior to: " + inputText);
                  }
              });

        break;

        case Types.STATE_DO_ACTIVITY:
        containerElementId = UmlIDUtil.getElementIdFromHeaderLabel(graphicalElementId);
        behavior = getOrThrow(modelIndex.getSemantic(containerElementId),
              Behavior.class, "No valid container with id " + graphicalElementId + " found");

        modelAccess.setBehaviorInState(modelState, behavior, Types.STATE_DO_ACTIVITY, inputText)
              .thenAccept(response -> {
                  if (!response.body()) {
                      throw new GLSPServerException("Could not change Behavior to: " + inputText);
                  }
              });

        break;

        case Types.STATE_EXIT_ACTIVITY:
        containerElementId = UmlIDUtil.getElementIdFromHeaderLabel(graphicalElementId);
        behavior = getOrThrow(modelIndex.getSemantic(containerElementId),
              Behavior.class, "No valid container with id " + graphicalElementId + " found");

        modelAccess.setBehaviorInState(modelState, behavior, Types.STATE_EXIT_ACTIVITY, inputText)
              .thenAccept(response -> {
                  if (!response.body()) {
                      throw new GLSPServerException("Could not change Behavior to: " + inputText);
                  }
              });

        break;
        }

    }

   @Override
   public String getLabel() { return "Apply label"; }

   private String typeRegex() {
      return "\\:";
   }

   private String multiplicityRegex() {
      return "\\[(.*?)\\]";
   }

   private String getNameFromInput(final String inputText) {
      String name = inputText;
      Pattern pattern = Pattern.compile(typeRegex());
      Matcher matcher = pattern.matcher(inputText);
      if (matcher.find()) {
         name = inputText.split(typeRegex())[0];
      }
      return name.replaceAll(multiplicityRegex(), "").trim();
   }

   private String getTypeFromInput(final String inputText) {
      String type = "";
      Pattern pattern = Pattern.compile(typeRegex());
      Matcher matcher = pattern.matcher(inputText);
      if (matcher.find()) {
         type = inputText.split(typeRegex())[1];
      }
      return type.replaceAll(multiplicityRegex(), "").trim();
   }

   private String getBoundsFromInput(final String inputText) {
      String bounds = "";
      Pattern pattern = Pattern.compile(multiplicityRegex());
      Matcher matcher = pattern.matcher(inputText);
      if (matcher.find()) {
         bounds = matcher.group(1);
      }
      return bounds.trim();
   }

}
