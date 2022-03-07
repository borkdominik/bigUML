package com.eclipsesource.uml.glsp.actions.activity.edgelabels;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.actions.BasicActionHandler;
import org.eclipse.glsp.server.model.GModelState;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.ControlFlow;

import com.eclipsesource.uml.glsp.actions.UmlGetTypesActionHandler;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;

public class CreateWeightActionHandler extends BasicActionHandler<CreateWeightAction> {

   private static Logger LOGGER = Logger.getLogger(UmlGetTypesActionHandler.class.getSimpleName());

   @Override
   protected List<Action> executeAction(final CreateWeightAction actualAction, final GModelState gModelState) {
      LOGGER.info("Recieved create weight request");
      UmlModelState modelState = UmlModelState.getModelState(gModelState);
      EObject semanticElement = getOrThrow(modelState.getIndex().getSemantic(actualAction.getElementTypeId()),
         EObject.class,
         "Could not find element for id '" + actualAction.getElementTypeId() + "', no create weight action executed");
      UmlModelServerAccess modelServerAccess = UmlModelState.getModelServerAccess(gModelState);
      modelServerAccess.setWeight(modelState, (ControlFlow) semanticElement, "weigth").thenAccept(response -> {
         if (!response.body()) {
            throw new GLSPServerException(
               "Could not execute remove Guard operation on ActivityEdge: " + semanticElement.toString());
         }
      });
      return new ArrayList<>();
   }

}