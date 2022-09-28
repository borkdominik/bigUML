package com.eclipsesource.uml.glsp.uml.statemachine_diagram.operations;

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
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.PseudostateKind;
import org.eclipse.uml2.uml.Region;
import org.eclipse.uml2.uml.StateMachine;

import com.eclipsesource.uml.glsp.model.UmlModelIndex;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.statemachine_diagram.StateMachineModelServerAccess;
import com.eclipsesource.uml.glsp.uml.statemachine_diagram.constants.StateMachineTypes;

public class CreateStateMachineDiagramChildNodeOperationHandler
   extends EMSBasicCreateOperationHandler<CreateNodeOperation, StateMachineModelServerAccess> {

   public CreateStateMachineDiagramChildNodeOperationHandler() {
      super(handledElementTypeIds);
   }

   private static List<String> handledElementTypeIds = List.of(StateMachineTypes.STATE, StateMachineTypes.INITIAL_STATE,
      StateMachineTypes.DEEP_HISTORY,
      StateMachineTypes.SHALLOW_HISTORY, StateMachineTypes.JOIN, StateMachineTypes.FORK, StateMachineTypes.JUNCTION,
      StateMachineTypes.CHOICE, StateMachineTypes.ENTRY_POINT,
      StateMachineTypes.EXIT_POINT, StateMachineTypes.TERMINATE, StateMachineTypes.FINAL_STATE);

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
   public void executeOperation(final CreateNodeOperation operation, final StateMachineModelServerAccess modelAccess) {

      UmlModelState modelState = getUmlModelState();
      UmlModelIndex modelIndex = modelState.getIndex();
      String containerId = operation.getContainerId();
      String elementTypeId = operation.getElementTypeId();

      /*
       * StateMachine containerStateMachine = getOrThrow(modelIndex.getSemantic(containerId), StateMachine.class,
       * "No valid State Machine container with id " + operation.getContainerId() + " found");
       */

      NamedElement containerElement = getOrThrow(modelIndex.getSemantic(containerId), NamedElement.class,
         "No valid container element with id " + operation.getContainerId() + " found");

      Region region = null;
      if (containerElement instanceof StateMachine) {
         region = ((StateMachine) containerElement).getRegions().get(0);
      } else if (containerElement instanceof Region) {
         region = (Region) containerElement;
      }

      if (StateMachineTypes.STATE.equals(elementTypeId)) {
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
      } else if (StateMachineTypes.PSEUDOSTATES.contains(elementTypeId)) {
         System.out.println("PSEUDO KIND " + getPseudostateKind(elementTypeId));
         Optional<GModelElement> container = modelIndex.get(operation.getContainerId());
         Optional<GModelElement> structCompartment = container.filter(GNode.class::isInstance)
            .map(GNode.class::cast)
            .flatMap(this::getStructureCompartment);
         Optional<GPoint> relativeLocation = getRelativeLocation(operation, operation.getLocation(), structCompartment);
         modelAccess
            .addPseudostate(UmlModelState.getModelState(modelState), region, getPseudostateKind(elementTypeId),
               relativeLocation)
            .thenAccept(response -> {
               if (!response.body()) {
                  throw new GLSPServerException("Could not execute create operation on new State node");
               }
            });
      } else if (StateMachineTypes.FINAL_STATE.equals(elementTypeId)) {
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
         .filter(comp -> StateMachineTypes.STRUCTURE.equals(comp.getType())).findFirst();
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
         case StateMachineTypes.INITIAL_STATE:
            return PseudostateKind.INITIAL_LITERAL;
         case StateMachineTypes.DEEP_HISTORY:
            return PseudostateKind.DEEP_HISTORY_LITERAL;
         case StateMachineTypes.SHALLOW_HISTORY:
            return PseudostateKind.SHALLOW_HISTORY_LITERAL;
         case StateMachineTypes.JOIN:
            return PseudostateKind.JOIN_LITERAL;
         case StateMachineTypes.FORK:
            return PseudostateKind.FORK_LITERAL;
         case StateMachineTypes.JUNCTION:
            return PseudostateKind.JUNCTION_LITERAL;
         case StateMachineTypes.CHOICE:
            return PseudostateKind.CHOICE_LITERAL;
         case StateMachineTypes.ENTRY_POINT:
            return PseudostateKind.ENTRY_POINT_LITERAL;
         case StateMachineTypes.EXIT_POINT:
            return PseudostateKind.EXIT_POINT_LITERAL;
         case StateMachineTypes.TERMINATE:
            return PseudostateKind.TERMINATE_LITERAL;
         default:
            return null;
      }
   }

   @Override
   public String getLabel() { return "Create Classifier child node"; }
}
