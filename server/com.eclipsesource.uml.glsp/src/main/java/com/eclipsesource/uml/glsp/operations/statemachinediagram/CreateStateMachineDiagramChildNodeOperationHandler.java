package com.eclipsesource.uml.glsp.operations.statemachinediagram;

import com.eclipsesource.uml.glsp.model.UmlModelIndex;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicCreateOperationHandler;
import org.eclipse.glsp.graph.*;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.glsp.server.utils.GeometryUtil;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.PseudostateKind;
import org.eclipse.uml2.uml.Region;
import org.eclipse.uml2.uml.StateMachine;

import java.util.List;
import java.util.Optional;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

public class CreateStateMachineDiagramChildNodeOperationHandler
      extends EMSBasicCreateOperationHandler<CreateNodeOperation, UmlModelServerAccess> {

   public CreateStateMachineDiagramChildNodeOperationHandler() {
      super(handledElementTypeIds);
   }

   private static List<String> handledElementTypeIds = List.of(Types.STATE, Types.INITIAL_STATE, Types.DEEP_HISTORY,
         Types.SHALLOW_HISTORY, Types.JOIN, Types.FORK, Types.JUNCTION, Types.CHOICE, Types.ENTRY_POINT,
         Types.EXIT_POINT, Types.TERMINATE, Types.FINAL_STATE);

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
      String containerId = operation.getContainerId();
      String elementTypeId = operation.getElementTypeId();

      /*StateMachine containerStateMachine = getOrThrow(modelIndex.getSemantic(containerId), StateMachine.class,
            "No valid State Machine container with id " + operation.getContainerId() + " found");*/

      NamedElement containerElement = getOrThrow(modelIndex.getSemantic(containerId), NamedElement.class,
            "No valid container element with id " + operation.getContainerId() + " found");

      Region region = null;
      if (containerElement instanceof StateMachine) {
         region = ((StateMachine) containerElement).getRegions().get(0);
      } else if (containerElement instanceof Region) {
         region = (Region) containerElement;
      }


      if (Types.STATE.equals(elementTypeId)) {
         Optional<GModelElement> container = modelIndex.get(operation.getContainerId());
         Optional<GModelElement> structCompartment = container.filter(GNode.class::isInstance)
               .map(GNode.class::cast)
               .flatMap(this::getStructureCompartment);
         Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), structCompartment);
         modelAccess.addState(UmlModelState.getModelState(modelState), region, relativeLocation)
               .thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException("Could not execute create operation on new State node");
                  }
               });
      } else if (Types.PSEUDOSTATES.contains(elementTypeId)) {
         System.out.println("PSEUDO KIND " + getPseudostateKind(elementTypeId));
         Optional<GModelElement> container = modelIndex.get(operation.getContainerId());
         Optional<GModelElement> structCompartment = container.filter(GNode.class::isInstance)
               .map(GNode.class::cast)
               .flatMap(this::getStructureCompartment);
         Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), structCompartment);
         modelAccess.addPseudostate(UmlModelState.getModelState(modelState), region, getPseudostateKind(elementTypeId), relativeLocation)
               .thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException("Could not execute create operation on new State node");
                  }
               });
      } else if (Types.FINAL_STATE.equals(elementTypeId)) {
         Optional<GModelElement> container = modelIndex.get(operation.getContainerId());
         Optional<GModelElement> structCompartment = container.filter(GNode.class::isInstance)
               .map(GNode.class::cast)
               .flatMap(this::getStructureCompartment);
         Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), structCompartment);
         modelAccess.addFinalState(UmlModelState.getModelState(modelState), region, relativeLocation)
               .thenAccept(response -> {
                  if (!response.body()) {
                     throw new GLSPServerException("Could not execute create operation on new State node");
                  }
               });
      }
   }


   protected Optional<GCompartment> getStructureCompartment(final GNode packageable) {
      return packageable.getChildren().stream().filter(GCompartment.class::isInstance).map(GCompartment.class::cast)
            .filter(comp -> Types.STRUCTURE.equals(comp.getType())).findFirst();
   }

   protected Optional<GPoint> getRelativeLocation(final CreateNodeOperation operation,
                                                  final Optional<GPoint> absoluteLocation, final Optional<GModelElement> container) {
      if (absoluteLocation.isPresent() && container.isPresent()) {
         // When creating elements on a parent node (other than the root Graph),
         // prevent the node from using negative coordinates
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

   private PseudostateKind getPseudostateKind(final String type) {
      switch (type) {
         case Types.INITIAL_STATE:
            return PseudostateKind.INITIAL_LITERAL;
         case Types.DEEP_HISTORY:
            return PseudostateKind.DEEP_HISTORY_LITERAL;
         case Types.SHALLOW_HISTORY:
            return PseudostateKind.SHALLOW_HISTORY_LITERAL;
         case Types.JOIN:
            return PseudostateKind.JOIN_LITERAL;
         case Types.FORK:
            return PseudostateKind.FORK_LITERAL;
         case Types.JUNCTION:
            return PseudostateKind.JUNCTION_LITERAL;
         case Types.CHOICE:
            return PseudostateKind.CHOICE_LITERAL;
         case Types.ENTRY_POINT:
            return PseudostateKind.ENTRY_POINT_LITERAL;
         case Types.EXIT_POINT:
            return PseudostateKind.EXIT_POINT_LITERAL;
         case Types.TERMINATE:
            return PseudostateKind.TERMINATE_LITERAL;
         default:
            return null;
      }
   }

   @Override
   public String getLabel() {
      return "Create Classifier child node";
   }
}
