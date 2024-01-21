/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.core.features.tool_palette;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.glsp.server.features.toolpalette.PaletteItem;
import org.eclipse.glsp.server.features.toolpalette.ToolPaletteItemProvider;

import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class UmlToolPaletteItemProvider
   implements ToolPaletteItemProvider {

   private static Logger LOGGER = LogManager.getLogger(UmlToolPaletteItemProvider.class.getSimpleName());

   @Inject
   protected Map<Representation, Set<ToolPaletteConfiguration>> palettes;

   @Inject
   protected UmlModelState modelState;

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return modelState.getRepresentation().map(representation -> {
         var items = new ArrayList<PaletteItem>();

         if (palettes.containsKey(representation)) {
            palettes.get(representation).stream()
               .forEachOrdered(contribution -> {
                  items.addAll(contribution.getItems(args));
               });
         } else {
            throw new IllegalArgumentException(
               String.format("Representation %s did not provide any tool palette items", representation));
         }

         return items;
      }).orElseGet(() -> {
         LOGGER.warn("Could not read representation from modelstate.");
         return new ArrayList<>();
      });
   }
}
