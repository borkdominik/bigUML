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
package com.eclipsesource.uml.glsp.uml.activity_diagram.operations;

import com.eclipsesource.uml.glsp.model.UmlModelIndex;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.google.common.collect.Lists;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.graph.*;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.glsp.server.utils.GeometryUtil;
import org.eclipse.uml2.uml.*;

import java.util.List;
import java.util.Optional;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

public class CreateActivityDiagramChildNodeOperationHandler
      extends EMSBasicCreateOperationHandler<CreateNodeOperation, UmlModelServerAccess> {

   public CreateActivityDiagramChildNodeOperationHandler() {
      super(handledElementTypeIds);
   }

   private static List<String> handledElementTypeIds = Lists.newArrayList(
         Types.ACTION, Types.ACCEPTEVENT, Types.TIMEEVENT,
         Types.SENDSIGNAL, Types.CALL, Types.INITIALNODE, Types.FINALNODE, Types.FLOWFINALNODE,
         Types.DECISIONMERGENODE, Types.FORKJOINNODE, Types.PARAMETER, Types.CENTRALBUFFER, Types.DATASTORE,
         Types.CONDITION
   );

   @Override
   public boolean handles(final Operation execAction) {
      if (execAction instanceof CreateNodeOperation) {
         CreateNodeOperation action = (CreateNodeOperation) execAction;
         return handledElementTypeIds.contains(action.getElementTypeId());
      }
      return false;
   }

   protected UmlModelState getUmlModelState() {
      return (UmlModelState) getEMSModelState();
   }

   @Override
   public void executeOperation(final CreateNodeOperation operation, final UmlModelServerAccess modelAccess) {

      UmlModelState modelState = getUmlModelState();
      UmlModelIndex modelIndex = modelState.getIndex();
      
      NamedElement parentContainer = getOrThrow(
            modelIndex.getSemantic(operation.getContainerId(), NamedElement.class),
            "No parent container found!");

      System.out.println("PARENT " + parentContainer.getClass());

      switch (operation.getElementTypeId()) {
         case (Types.ACTION): {
            if (parentContainer instanceof Activity
                  || parentContainer instanceof ActivityPartition
                  || parentContainer instanceof InterruptibleActivityRegion) {
               Optional<GModelElement> containerActivity = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), getStructureCompartmentGModelElement(containerActivity));
               modelAccess.addAction(getUmlModelState(), relativeLocation, parentContainer, OpaqueAction.class)
                     .thenAccept(response -> {
                        if (!response.body()) {
                           throw new GLSPServerException("Could not create operation on new Action node");
                        }
                     });
            }
            break;
         }
         case (Types.SENDSIGNAL): {
            if (parentContainer instanceof Activity) {
               Optional<GModelElement> containerActivity = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), getStructureCompartmentGModelElement(containerActivity));
               modelAccess.addAction(getUmlModelState(), relativeLocation, parentContainer, SendSignalAction.class)
                     .thenAccept(response -> {
                        if (!response.body()) {
                           throw new GLSPServerException("Could not create operation on new Action node");
                        }
                     });
            }
            break;
         }
         case (Types.CALL): {
            if (parentContainer instanceof Activity
                  || parentContainer instanceof ActivityPartition
                  || parentContainer instanceof InterruptibleActivityRegion) {
               Optional<GModelElement> containerActivity = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), getStructureCompartmentGModelElement(containerActivity));
               modelAccess.addAction(getUmlModelState(), relativeLocation, parentContainer, CallBehaviorAction.class)
                     .thenAccept(response -> {
                        if (!response.body()) {
                           throw new GLSPServerException("Could not create operation on new Action node");
                        }
                     });
            }
         }
         case (Types.ACCEPTEVENT): {
            if (parentContainer instanceof Activity
                  || parentContainer instanceof ActivityPartition
                  || parentContainer instanceof InterruptibleActivityRegion) {
               Optional<GModelElement> containerActivity = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), getStructureCompartmentGModelElement(containerActivity));
               modelAccess.addEventAction(getUmlModelState(), relativeLocation, parentContainer, false)
                     .thenAccept(response -> {
                        if (!response.body()) {
                           throw new GLSPServerException("Could not create operation on new Action node");
                        }
                     });
            }
            break;
         }
         case (Types.TIMEEVENT): {
            if (parentContainer instanceof Activity
                  || parentContainer instanceof ActivityPartition
                  || parentContainer instanceof InterruptibleActivityRegion) {
               Optional<GModelElement> containerActivity = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), getStructureCompartmentGModelElement(containerActivity));
               modelAccess.addEventAction(getUmlModelState(), relativeLocation, parentContainer, true)
                     .thenAccept(response -> {
                        if (!response.body()) {
                           throw new GLSPServerException("Could not create operation on new Action node");
                        }
                     });
            }
            break;
         }
         case (Types.PARAMETER): {
            if (parentContainer instanceof Activity) {
               Optional<GModelElement> containerActivity = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), getStructureCompartmentGModelElement(containerActivity));
               modelAccess.addParameter(getUmlModelState(), relativeLocation, (Activity) parentContainer)
                     .thenAccept(response -> {
                        if (!response.body()) {
                           throw new GLSPServerException("Could not create operation on new Action node");
                        }
                     });
            }
            break;
         }
         // FIXME: NDOE IS NOT RENDERED AND MAYBE NOT A CLASSIC CHILD NODE AS THE OTHERS!!!
         case (Types.CONDITION): {
            if (parentContainer instanceof Activity) {
               Optional<GModelElement> containerActivity = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), getStructureCompartmentGModelElement(containerActivity));
               modelAccess.addCondition(getUmlModelState(), relativeLocation, (Activity) parentContainer, true)
                     .thenAccept(response -> {
                        if (!response.body()) {
                           throw new GLSPServerException("Could not create operation on new Action node");
                        }
                     });
            }
            break;
         }
         case (Types.CENTRALBUFFER): {
            if (parentContainer instanceof Activity) {
               Optional<GModelElement> containerActivity = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), getStructureCompartmentGModelElement(containerActivity));
               modelAccess.addObjectNode(getUmlModelState(), relativeLocation, (Activity) parentContainer, CentralBufferNode.class)
                     .thenAccept(response -> {
                        if (!response.body()) {
                           throw new GLSPServerException("Could not create operation on new Action node");
                        }
                     });
            }
            break;
         }
         case (Types.DATASTORE): {
            if (parentContainer instanceof Activity) {
               Optional<GModelElement> containerActivity = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), getStructureCompartmentGModelElement(containerActivity));
               modelAccess.addObjectNode(getUmlModelState(), relativeLocation, (Activity) parentContainer, DataStoreNode.class)
                     .thenAccept(response -> {
                        if (!response.body()) {
                           throw new GLSPServerException("Could not create operation on new Action node");
                        }
                     });
            }
            break;
         }
         case (Types.INITIALNODE): {
            if (parentContainer instanceof Activity
                  || parentContainer instanceof ActivityPartition
                  || parentContainer instanceof InterruptibleActivityRegion) {
               Optional<GModelElement> containerActivity = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), getStructureCompartmentGModelElement(containerActivity));
               modelAccess.addControlNode(getUmlModelState(), relativeLocation, parentContainer, InitialNode.class)
                     .thenAccept(response -> {
                        if (!response.body()) {
                           throw new GLSPServerException("Could not create operation on new Action node");
                        }
                     });
            }
            break;
         }
         case (Types.FINALNODE): {
            if (parentContainer instanceof Activity
                  || parentContainer instanceof ActivityPartition
                  || parentContainer instanceof InterruptibleActivityRegion) {
               Optional<GModelElement> containerActivity = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), getStructureCompartmentGModelElement(containerActivity));
               modelAccess.addControlNode(getUmlModelState(), relativeLocation, parentContainer, FinalNode.class)
                     .thenAccept(response -> {
                        if (!response.body()) {
                           throw new GLSPServerException("Could not create operation on new Action node");
                        }
                     });
            }
            break;
         }
         case (Types.FLOWFINALNODE): {
            if (parentContainer instanceof Activity
                  || parentContainer instanceof ActivityPartition
                  || parentContainer instanceof InterruptibleActivityRegion) {
               Optional<GModelElement> containerActivity = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), getStructureCompartmentGModelElement(containerActivity));
               modelAccess.addControlNode(getUmlModelState(), relativeLocation, parentContainer, FlowFinalNode.class)
                     .thenAccept(response -> {
                        if (!response.body()) {
                           throw new GLSPServerException("Could not create operation on new Action node");
                        }
                     });
            }
            break;
         }
         case (Types.DECISIONMERGENODE): {
            if (parentContainer instanceof Activity
                  || parentContainer instanceof ActivityPartition
                  || parentContainer instanceof InterruptibleActivityRegion) {
               Optional<GModelElement> containerActivity = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), getStructureCompartmentGModelElement(containerActivity));
               modelAccess.addControlNode(getUmlModelState(), relativeLocation, parentContainer, DecisionNode.class)
                     .thenAccept(response -> {
                        if (!response.body()) {
                           throw new GLSPServerException("Could not create operation on new Action node");
                        }
                     });
            }
            break;
         }
         case (Types.FORKJOINNODE): {
            if (parentContainer instanceof Activity
                  || parentContainer instanceof ActivityPartition
                  || parentContainer instanceof InterruptibleActivityRegion) {
               Optional<GModelElement> containerActivity = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), getStructureCompartmentGModelElement(containerActivity));
               modelAccess.addControlNode(getUmlModelState(), relativeLocation, parentContainer, ForkNode.class)
                     .thenAccept(response -> {
                        if (!response.body()) {
                           throw new GLSPServerException("Could not create operation on new Action node");
                        }
                     });
            }
            break;
         }
         // TODO: check how to set the pin always to the same position within the activity node
         case (Types.PIN): {
            modelAccess.addPin(UmlModelState.getModelState(modelState), (Action) parentContainer)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new Pin node");
                     }
                  });
            break;
         }
      }
   }

   protected Optional<GModelElement> getStructureCompartmentGModelElement(final Optional<GModelElement> container) {
      return container.filter(GNode.class::isInstance)
            .map(GNode.class::cast)
            .flatMap(this::getStructureCompartment);
   }


   protected Optional<GCompartment> getStructureCompartment(final GNode packageable) {
      return packageable.getChildren().stream().filter(GCompartment.class::isInstance).map(GCompartment.class::cast)
            .filter(comp -> Types.STRUCTURE.equals(comp.getType())).findFirst();
   }

   protected Optional<GPoint> getRelativeLocation(final CreateNodeOperation operation,
                                                  final Optional<GPoint> absoluteLocation,
                                                  final Optional<GModelElement> container) {
      if (absoluteLocation.isPresent() && container.isPresent()) {
         boolean allowNegativeCoordinates = container.get() instanceof GGraph;
         GModelElement modelElement = container.get();
         if (modelElement instanceof GBoundsAware) {
            try {
               GPoint relativePosition = GeometryUtil.absoluteToRelative(absoluteLocation.get(),
                     (GBoundsAware) modelElement);
               GPoint relativeLocation = allowNegativeCoordinates
                     ? relativePosition
                     : GraphUtil.point(Math.max(0, relativePosition.getX()), Math.max(0, relativePosition.getY()));
               return Optional.of(relativeLocation);
            } catch (IllegalArgumentException ex) {
               return absoluteLocation;
            }
         }
      }
      return Optional.empty();
   }

   @Override
   public String getLabel() {
      return "Create uml classifier";
   }

}
