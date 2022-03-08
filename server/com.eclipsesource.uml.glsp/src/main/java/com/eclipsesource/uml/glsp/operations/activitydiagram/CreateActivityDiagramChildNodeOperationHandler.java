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

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.List;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.graph.GDimension;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.impl.GDimensionImpl;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.*;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import com.google.common.collect.Lists;

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

      String containerId = operation.getContainerId();

      Element container = getOrThrow(modelState.getIndex().getSemantic(containerId), Element.class,
         "No valid activity container with id " + containerId + " found");
      String elementTypeId = operation.getElementTypeId();
      GPoint location = getPosition(modelState, container, operation.getLocation().orElse(GraphUtil.point(0, 0)));

      switch (elementTypeId) {
         case (Types.ACTION): {
            modelAccess.addAction(UmlModelState.getModelState(modelState), location, container, OpaqueAction.class)
                    .thenAccept(response -> {
                       if (!response.body()) {
                          throw new GLSPServerException("Could not execute create operation on new Action node");
                       }
                    });
            break;
         }
         case (Types.SENDSIGNAL): {
            modelAccess.addAction(UmlModelState.getModelState(modelState), location, container, SendSignalAction.class)
                    .thenAccept(response -> {
                       if (!response.body()) {
                          throw new GLSPServerException("Could not execute create operation on new Action node");
                       }
                    });
            break;
         }
         case (Types.CALL): {
            modelAccess.addAction(UmlModelState.getModelState(modelState), location, container, CallAction.class)
                    .thenAccept(response -> {
                       if (!response.body()) {
                          throw new GLSPServerException("Could not execute create operation on new Action node");
                       }
                    });
            break;
         }
         case (Types.ACCEPTEVENT): {
            modelAccess.addEventAction(UmlModelState.getModelState(modelState), location, container, false)
                    .thenAccept(response -> {
                       if (!response.body()) {
                          throw new GLSPServerException("Could not execute create operation on new Action node");
                       }
                    });
            break;
         }
         case (Types.TIMEEVENT): {
            modelAccess.addEventAction(UmlModelState.getModelState(modelState), location, container, true)
                    .thenAccept(response -> {
                       if (!response.body()) {
                          throw new GLSPServerException("Could not execute create operation on new Action node");
                       }
                    });
            break;
         }
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
            break;}
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
         default:
            break;
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

   @Override
   public String getLabel() { return "Create uml classifier"; }

}
