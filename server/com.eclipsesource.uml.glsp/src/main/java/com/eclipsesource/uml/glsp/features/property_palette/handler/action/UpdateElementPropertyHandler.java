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
package com.eclipsesource.uml.glsp.features.property_palette.handler.action;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.actions.AbstractActionHandler;
import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.common.RepresentationKey;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.google.inject.Inject;

public class UpdateElementPropertyHandler extends AbstractActionHandler<UpdateElementPropertyAction> {

   private static final Logger LOG = LogManager.getLogger(UpdateElementPropertyHandler.class);

   @Inject
   protected UmlModelState modelState;

   @Inject
   protected DiagramElementPropertyMapperRegistry registry;

   @Override
   protected List<Action> executeAction(final UpdateElementPropertyAction action) {
      return modelState.getRepresentation().map(representation -> {
         var elementId = action.getElementId();

         var semanticElement = getOrThrow(modelState.getIndex().getEObject(elementId),
            EObject.class,
            "Could not find semantic element for id '" + elementId + "', no property updating executed.");

         var mapper = registry.get(RepresentationKey.of(representation, semanticElement.getClass()))
            .orElseThrow(
               () -> {
                  registry.printContent();
                  return new GLSPServerException(
                     "No property palette mapper found for class " + semanticElement.getClass().getName());
               });

         var operation = mapper
            .map(action)
            .orElseThrow(
               () -> {
                  return new GLSPServerException(
                     "No update operation found for property id " + action.getPropertyId());
               });

         return List.<Action> of(operation);
      }).orElse(List.of());
   }
}
