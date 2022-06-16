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
package com.eclipsesource.uml.glsp.operations.activitydiagram;

import com.eclipsesource.uml.glsp.model.UmlModelIndex;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import com.google.common.collect.Lists;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.graph.*;
import org.eclipse.glsp.graph.impl.GDimensionImpl;
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

      String elementTypeId = operation.getElementTypeId();

      //String containerId = operation.getContainerId();
      /*Element container = getOrThrow(modelState.getIndex().getSemantic(containerId), Element.class,
            "No valid activity container with id " + containerId + " found");*/
      //GPoint location = getPosition(modelState, container, operation.getLocation().orElse(GraphUtil.point(0, 0)));

      NamedElement parentContainer = getOrThrow(
            modelIndex.getSemantic(operation.getContainerId(), NamedElement.class),
            "No parent container found!");
      switch (elementTypeId) {
         case (Types.ACTION): {
            if (parentContainer instanceof Activity
                  || parentContainer instanceof ActivityPartition
                  || parentContainer instanceof InterruptibleActivityRegion) {
               Optional<GModelElement> containerActivity = modelIndex.get(operation.getContainerId());
               Optional<GModelElement> structCompartment = containerActivity
                     .filter(GNode.class::isInstance)
                     .map(GNode.class::cast)
                     .flatMap(this::getStructureCompartment);
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), structCompartment);
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
               Optional<GModelElement> structCompartment = containerActivity
                     .filter(GNode.class::isInstance)
                     .map(GNode.class::cast)
                     .flatMap(this::getStructureCompartment);
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), structCompartment);
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
               Optional<GModelElement> structCompartment = containerActivity
                     .filter(GNode.class::isInstance)
                     .map(GNode.class::cast)
                     .flatMap(this::getStructureCompartment);
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), structCompartment);
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
               Optional<GModelElement> structCompartment = containerActivity
                     .filter(GNode.class::isInstance)
                     .map(GNode.class::cast)
                     .flatMap(this::getStructureCompartment);
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), structCompartment);
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
               Optional<GModelElement> structCompartment = containerActivity
                     .filter(GNode.class::isInstance)
                     .map(GNode.class::cast)
                     .flatMap(this::getStructureCompartment);
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), structCompartment);
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
               Optional<GModelElement> structCompartment = containerActivity
                     .filter(GNode.class::isInstance)
                     .map(GNode.class::cast)
                     .flatMap(this::getStructureCompartment);
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), structCompartment);
               modelAccess.addParameter(getUmlModelState(), relativeLocation, (Activity) parentContainer)
                     .thenAccept(response -> {
                        if (!response.body()) {
                           throw new GLSPServerException("Could not create operation on new Action node");
                        }
                     });
            }
            break;
         }
         case (Types.CONDITION): {
            break;
         }
         case (Types.CENTRALBUFFER): {
            break;
         }
         case (Types.DATASTORE): {
            break;
         }
         case (Types.INITIALNODE): {
            break;
         }
         case (Types.FINALNODE): {
            break;
         }
         case (Types.FLOWFINALNODE): {
            break;
         }
         case (Types.DECISIONMERGENODE): {
            break;
         }
         case (Types.FORKJOINNODE): {
            break;
         }
         case (Types.PIN): {
            break;
         }

         /*
         case (Types.PARAMETER): {
            modelAccess.addParameter(UmlModelState.getModelState(modelState), (Activity) container)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new Action node");
                     }
                  });
            break;
         }
         case (Types.CONDITION): {
            modelAccess.addCondition(UmlModelState.getModelState(modelState), (Activity) container, true)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new Action node");
                     }
                  });
            break;
         }
         case (Types.CENTRALBUFFER): {
            modelAccess.addObjectNode(UmlModelState.getModelState(modelState), location, container, CentralBufferNode.class)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new Action node");
                     }
                  });
            break;
         }
         case (Types.DATASTORE): {
            modelAccess.addObjectNode(UmlModelState.getModelState(modelState), location, container, DataStoreNode.class)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new Action node");
                     }
                  });
            break;
         }
         case (Types.INITIALNODE): {
            modelAccess.addControlNode(UmlModelState.getModelState(modelState), location, container, InitialNode.class)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new Action node");
                     }
                  });
            break;
         }
         case (Types.FINALNODE): {
            modelAccess.addControlNode(UmlModelState.getModelState(modelState), location, container, FinalNode.class)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new Action node");
                     }
                  });
            break;
         }
         case (Types.FLOWFINALNODE): {
            modelAccess.addControlNode(UmlModelState.getModelState(modelState), location, container, FlowFinalNode.class)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new Action node");
                     }
                  });
            break;
         }
         case (Types.DECISIONMERGENODE): {
            modelAccess.addControlNode(UmlModelState.getModelState(modelState), location, container, DecisionNode.class)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new Action node");
                     }
                  });
            break;
         }
         case (Types.FORKJOINNODE): {
            modelAccess.addControlNode(UmlModelState.getModelState(modelState), location, container, ForkNode.class)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new Action node");
                     }
                  });
            break;
         }
         case (Types.PIN): {
            System.out.println("goes into pin handler");
            modelAccess.addPin(UmlModelState.getModelState(modelState), (Action) container)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new Pin node");
                     }
                  });
            break;
         }
         default:
            break;*/
      }
   }


   private GPoint getPosition(final UmlModelState modelState, final Element container, final GPoint position) {
      Shape containerShape = modelState.getIndex().getNotation(container, Shape.class).get();

      double x = position.getX();
      double y = position.getY();
      x = Math.max(0, x - containerShape.getPosition().getX());
      y = Math.max(0, y - containerShape.getPosition().getY() - 43);
      GPoint location = GraphUtil.point(x, y);
      GDimension newShape = new GDimensionImpl();

      if (container instanceof Activity) {
         newShape.setHeight(50 * 2);
         newShape.setWidth(160 * 2);
         System.out.println("Height " + newShape.getHeight() + " Width new" + newShape.getWidth());
         containerShape.setSize(newShape);
         System.out.println("Height " + containerShape.getSize().getHeight() + " Width " + containerShape.getSize().getWidth());
         return GraphUtil.point(x - 150, y - 50);
      } else if (container instanceof ActivityPartition) {
         return getPosition(modelState, container.getOwner(), location);
      }
      return GraphUtil.point(0, 0);
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
