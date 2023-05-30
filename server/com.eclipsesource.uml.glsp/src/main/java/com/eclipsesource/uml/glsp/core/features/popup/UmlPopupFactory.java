/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.core.features.popup;

import java.util.Optional;

import javax.inject.Inject;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.glsp.graph.GHtmlRoot;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.server.features.popup.PopupModelFactory;
import org.eclipse.glsp.server.features.popup.RequestPopupModelAction;

import com.eclipsesource.uml.glsp.core.common.RepresentationKey;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;

public class UmlPopupFactory implements PopupModelFactory {
   private static Logger LOGGER = LogManager.getLogger(UmlPopupFactory.class.getSimpleName());

   @Inject
   protected UmlModelState modelState;
   @Inject
   protected PopupMapperRegistry registry;

   @Override
   public Optional<GHtmlRoot> createPopupModel(final GModelElement element, final RequestPopupModelAction action) {
      if (element != null) {
         var representation = modelState.getUnsafeRepresentation();

         return modelState.getIndex().getEObject(element).flatMap(semanticElement -> {
            var handler = registry.get(RepresentationKey.of(representation, semanticElement.getClass()));

            if (handler.isEmpty()) {
               LOGGER.debug("No PopupMapper found for element: " + semanticElement.getClass().getSimpleName());
            }

            return handler.flatMap(h -> h.map(semanticElement, action));
         });

      }
      return Optional.empty();
   }

}
