package com.eclipsesource.uml.glsp.uml.statemachine_diagram.actions;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.glsp.actions.handlers.EMSBasicActionHandler;
import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Transition;

import com.eclipsesource.uml.glsp.actions.UmlGetTypesActionHandler;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.statemachine_diagram.StateMachineModelServerAccess;

public class AddTransitionLabelActionHandler
   extends EMSBasicActionHandler<AddTransitionLabelAction, StateMachineModelServerAccess> {

   private static Logger logger = Logger.getLogger(UmlGetTypesActionHandler.class.getSimpleName());

   @Override
   public List<Action> executeAction(final AddTransitionLabelAction actualAction,
      final StateMachineModelServerAccess modelServerAccess) {
      logger.info("Received add transition label action");

      UmlModelState modelState = UmlModelState.getModelState(gModelState);
      EObject semanticElement = getOrThrow(modelState.getIndex().getSemantic(actualAction.getElementTypeId()),
         EObject.class,
         "Could not find element for id '" + actualAction.getElementTypeId()
            + "', no add transition label action executed");

      // UmlModelServerAccess modelServerAccess = UmlModelState.getModelServerAccess(gModelState);
      modelServerAccess.addTransitionLabel(modelState, (Transition) semanticElement, "transition label")
         .thenAccept(response -> {
            if (!response.body()) {
               throw new GLSPServerException(
                  "Could not execute add transition label on Transition: " + semanticElement.toString());
            }
         });
      return new ArrayList<>();
   }
}
