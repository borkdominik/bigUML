package com.eclipsesource.uml.glsp.operations.activitydiagram;

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
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.NamedElement;

import java.util.List;
import java.util.Optional;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

public class CreateActivityDiagramNodeOperationHandler
      extends EMSBasicCreateOperationHandler<CreateNodeOperation, UmlModelServerAccess> {

   public CreateActivityDiagramNodeOperationHandler() {
      super(handledElementTypeIds);
   }

   private static List<String> handledElementTypeIds = Lists.newArrayList(
         Types.ACTIVITY, Types.INTERRUPTIBLEREGION, Types.PARTITION
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

      switch (operation.getElementTypeId()) {
         case Types.ACTIVITY: {
            modelAccess.addActivity(UmlModelState.getModelState(modelState), operation.getLocation())
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new Activity node");
                     }
                  });
            break;
         }
         // TODO: NOT RENDERED!!!!!
         case Types.PARTITION: {
            if (parentContainer instanceof Activity) {
               System.out.println("REACHES HANDLER");
               Optional<GModelElement> container = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), getStructureCompartmentGModelElement(container));
               modelAccess.addPartition(UmlModelState.getModelState(modelState), relativeLocation, parentContainer)
                     .thenAccept(response -> {
                        if (!response.body()) {
                           throw new GLSPServerException("Could not execute create operation on new Activity node");
                        }
                     });
            }
            break;
            /*String containerId = operation.getContainerId();
            Shape containerShape = getOrThrow(modelState.getIndex().getNotation(containerId, Shape.class),
                  "No valid Shape container with id " + containerId + " found");
            EObject container = getOrThrow(modelState.getIndex().getSemantic(containerId),
                  "No valid partition container with id " + containerId + " found");
            double x = operation.getLocation().orElse(GraphUtil.point(0, 0)).getX();
            double y = operation.getLocation().orElse(GraphUtil.point(0, 0)).getY();
            x = Math.max(0, x - containerShape.getPosition().getX() - 72.5);
            y = Math.max(0, y - containerShape.getPosition().getY() - 32);
            GPoint location = GraphUtil.point(x, y);
            modelAccess.addPartition(UmlModelState.getModelState(modelState), location, container)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new Activity node");
                     }
                  });
            break;*/
         }
         // TODO: NOT RENDERED!!!!!
         case Types.INTERRUPTIBLEREGION: {
            if (parentContainer instanceof Activity) {
               Optional<GModelElement> container = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), getStructureCompartmentGModelElement(container));
               modelAccess.addInterruptibleRegion(UmlModelState.getModelState(modelState), relativeLocation, parentContainer)
                     .thenAccept(response -> {
                        if (!response.body()) {
                           throw new GLSPServerException("Could not execute create operation on new Activity node");
                        }
                     });
            }
            break;

            /*String containerId = operation.getContainerId();
            Shape containerShape = getOrThrow(modelState.getIndex().getNotation(containerId, Shape.class),
                  "No valid Shape container with id " + containerId + " found");
            EObject container = getOrThrow(modelState.getIndex().getSemantic(containerId),
                  "No valid partition container with id " + containerId + " found");*/


                /*GDimension newSize = new GDimensionImpl();
                newSize.setHeight(containerShape.getSize().getHeight() * 2);
                newSize.setWidth(containerShape.getSize().getWidth() * 2);
                containerShape.setSize(newSize);*/

            /*double x = operation.getLocation().orElse(GraphUtil.point(0, 0)).getX();
            double y = operation.getLocation().orElse(GraphUtil.point(0, 0)).getY();
            x = Math.max(0, x - containerShape.getPosition().getX() - 64);
            y = Math.max(0, y - containerShape.getPosition().getY() - 64);
            GPoint location = GraphUtil.point(x, y);


            modelAccess.addInterruptibleRegion(UmlModelState.getModelState(modelState), location, container)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new Activity node");
                     }
                  });
            break;*/
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
