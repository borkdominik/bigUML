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

public class RequestPropertyPaletteHandler extends AbstractActionHandler<RequestPropertyPaletteAction> {

   private static final Logger LOG = LogManager.getLogger(RequestPropertyPaletteHandler.class);

   @Inject
   protected UmlModelState modelState;

   @Inject
   protected DiagramElementPropertyMapperRegistry registry;

   @Override
   protected List<Action> executeAction(final RequestPropertyPaletteAction action) {
      return modelState.getRepresentation().map(representation -> {
         if (action.getElementId() == null) {
            return List.<Action> of(new SetPropertyPaletteAction());
         }

         var elementId = action.getElementId();

         var semanticElement = getOrThrow(modelState.getIndex().getEObject(elementId),
            EObject.class, "Could not find semantic element for id '" + elementId + "', no property mapping executed.");

         var mapper = registry.get(RepresentationKey.of(representation, semanticElement.getClass()));

         var propertyItems = mapper
            .orElseThrow(
               () -> {
                  registry.printContent();
                  return new GLSPServerException(
                     "No property palette mapper found for class " + semanticElement.getClass().getName());
               })
            .map(semanticElement);

         return List.<Action> of(new SetPropertyPaletteAction(propertyItems));
      }).orElse(List.of());
   }
}
