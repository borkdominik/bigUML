package com.eclipsesource.uml.glsp.uml.activity_diagram.operations;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.List;
import java.util.Optional;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.graph.GBoundsAware;
import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GGraph;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.glsp.server.utils.GeometryUtil;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.ActivityPartition;
import org.eclipse.uml2.uml.InterruptibleActivityRegion;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.glsp.model.UmlModelIndex;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.activity_diagram.ActivityModelServerAccess;
import com.eclipsesource.uml.glsp.uml.activity_diagram.constants.ActivityTypes;
import com.google.common.collect.Lists;

public class CreateActivityDiagramNodeOperationHandler
   extends EMSBasicCreateOperationHandler<CreateNodeOperation, ActivityModelServerAccess> {

   public CreateActivityDiagramNodeOperationHandler() {
      super(handledElementTypeIds);
   }

   private static List<String> handledElementTypeIds = Lists.newArrayList(
      ActivityTypes.ACTIVITY, ActivityTypes.INTERRUPTIBLEREGION, ActivityTypes.PARTITION);

   @Override
   public boolean handles(final Operation execAction) {
      if (execAction instanceof CreateNodeOperation) {
         CreateNodeOperation action = (CreateNodeOperation) execAction;
         return handledElementTypeIds.contains(action.getElementTypeId());
      }
      return false;
   }

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

   @Override
   public void executeOperation(final CreateNodeOperation operation, final ActivityModelServerAccess modelAccess) {

      UmlModelState modelState = getUmlModelState();
      UmlModelIndex modelIndex = modelState.getIndex();

      NamedElement parentContainer = getOrThrow(
         modelIndex.getSemantic(operation.getContainerId(), NamedElement.class),
         "No parent container found!");

      switch (operation.getElementTypeId()) {
         case ActivityTypes.ACTIVITY: {
            modelAccess.addActivity(UmlModelState.getModelState(modelState), operation.getLocation())
               .thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException("Could not execute create operation on new Activity node");
                  }
               });
            break;
         }
         case ActivityTypes.PARTITION: {
            // TODO: Check if the parenting is semantically correct
            if (parentContainer instanceof Activity ||
               parentContainer instanceof ActivityPartition ||
               parentContainer instanceof InterruptibleActivityRegion) {
               Optional<GModelElement> container = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(),
                  getStructureCompartmentGModelElement(container));
               modelAccess.addPartition(UmlModelState.getModelState(modelState), relativeLocation, parentContainer)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new Partition node");
                     }
                  });
            }
            break;
         }
         case ActivityTypes.INTERRUPTIBLEREGION: {
            // TODO: Check if the parenting is semantically correct
            if (parentContainer instanceof Activity ||
               parentContainer instanceof ActivityPartition ||
               parentContainer instanceof InterruptibleActivityRegion) {
               Optional<GModelElement> container = modelIndex.get(operation.getContainerId());
               Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(),
                  getStructureCompartmentGModelElement(container));
               modelAccess
                  .addInterruptibleRegion(UmlModelState.getModelState(modelState), relativeLocation, parentContainer)
                  .thenAccept(response -> {
                     if (!response.body()) {
                        throw new GLSPServerException("Could not execute create operation on new Activity node");
                     }
                  });
            }
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
         .filter(comp -> ActivityTypes.STRUCTURE.equals(comp.getType())).findFirst();
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
   public String getLabel() { return "Create uml classifier"; }
}
