package com.eclipsesource.uml.glsp.actions.activity.edgelabels;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.glsp.actions.handlers.EMSBasicActionHandler;
import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.ControlFlow;

import com.eclipsesource.uml.glsp.actions.UmlGetTypesActionHandler;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;

public class CreateWeightActionHandler extends EMSBasicActionHandler<CreateWeightAction, UmlModelServerAccess> {

   private static Logger LOGGER = Logger.getLogger(UmlGetTypesActionHandler.class.getSimpleName());

   @Override
   public List<Action> executeAction(CreateWeightAction createWeightAction, UmlModelServerAccess modelServerAccess) {
      LOGGER.info("Recieved create weight request");
      UmlModelState modelState = UmlModelState.getModelState(gModelState);
      EObject semanticElement = getOrThrow(modelState.getIndex().getSemantic(createWeightAction.getElementTypeId()),
              EObject.class,
              "Could not find element for id '" + createWeightAction.getElementTypeId() + "', no create weight action executed");

      modelServerAccess.setWeight(modelState, (ControlFlow) semanticElement, "weigth").thenAccept(response -> {
         if (!response.body()) {
            throw new GLSPServerException(
                    "Could not execute remove Guard operation on ActivityEdge: " + semanticElement.toString());
         }
      });
      return new ArrayList<>();   }
}
