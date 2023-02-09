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

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.glsp.server.actions.AbstractActionHandler;
import org.eclipse.glsp.server.actions.Action;

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
         var elementId = action.getElementId();

         if (elementId == null) {
            return List.<Action> of(new SetPropertyPaletteAction());
         }

         var semanticElementOpt = modelState.getIndex().getEObject(elementId);
         if (semanticElementOpt.isEmpty()) {
            return List.<Action> of(new SetPropertyPaletteAction());
         }
         var semanticElement = semanticElementOpt.get();

         var mapper = registry.get(RepresentationKey.of(representation, semanticElement.getClass()));

         var propertyPalette = mapper
            .map(m -> m.map(semanticElement))
            .orElse(null);

         return List.<Action> of(new SetPropertyPaletteAction(propertyPalette));
      }).orElse(List.of(new SetPropertyPaletteAction()));
   }
}
