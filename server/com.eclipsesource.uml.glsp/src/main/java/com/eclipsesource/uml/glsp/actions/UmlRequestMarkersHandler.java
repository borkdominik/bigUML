/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.actions;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.emfcloud.modelserver.glsp.actions.handlers.AbstractEMSActionHandler;
import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.actions.ServerMessageAction;
import org.eclipse.glsp.server.features.validation.Marker;
import org.eclipse.glsp.server.features.validation.ModelValidator;
import org.eclipse.glsp.server.features.validation.RequestMarkersAction;
import org.eclipse.glsp.server.features.validation.SetMarkersAction;
import org.eclipse.glsp.server.types.Severity;

import com.google.inject.Inject;

public class UmlRequestMarkersHandler extends AbstractEMSActionHandler<RequestMarkersAction> {

   private static final Logger LOG = LogManager.getLogger(UmlRequestMarkersHandler.class);

   @Inject
   protected Optional<ModelValidator> validator;

   @Override
   @SuppressWarnings("checkstyle:cyclomaticComplexity")
   public List<Action> executeAction(final RequestMarkersAction action) {
      List<String> elementsIDs = action.getElementsIDs();
      if (validator.isEmpty()) {
         LOG.warn("Cannot compute markers! No implementation for " + ModelValidator.class + " has been bound");
         return none();
      }

      // if no element ID is provided, compute the markers for the complete model
      if (elementsIDs == null || elementsIDs.size() == 0
         || (elementsIDs.size() == 1 && "EMPTY".equals(elementsIDs.get(0)))) {
         elementsIDs = modelState.getRoot().getChildren().stream().map(c -> c.getId()).collect(Collectors.toList());
      }

      List<Marker> markers = new ArrayList<>();
      var currentModelIndex = modelState.getIndex();
      for (String elementID : elementsIDs) {
         var modelElement = currentModelIndex.get(elementID);
         if (modelElement.isPresent()) {
            markers.addAll(validator.get().validate(modelElement.get()));
         }
      }

      var notificationAction = getValidationNotification(markers);
      return listOf(new SetMarkersAction(markers), notificationAction);
   }

   private ServerMessageAction getValidationNotification(final List<Marker> listOfMarkers) {
      if (listOfMarkers.size() == 0) {
         return new ServerMessageAction(Severity.INFO,
            "The state of the diagram is valid.",
            3000);
      }

      return new ServerMessageAction(Severity.ERROR,
         "The state of the diagram is invalid. Please check the indicators on the diagram.",
         4000);
   }
}
