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
package com.eclipsesource.uml.glsp.core.features.toolpalette;

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
   private Map<Representation, Set<DiagramPalette>> palettes;

   @Inject
   private UmlModelState modelState;

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      var representation = modelState.getUnsafeRepresentation();
      var items = new ArrayList<PaletteItem>();

      palettes.get(representation).stream()
         .forEachOrdered(contribution -> {
            items.addAll(contribution.getItems(args));
         });

      return items;
   }
}
