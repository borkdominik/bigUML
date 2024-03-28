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
package com.borkdominik.big.glsp.uml.uml.representation.information_flow;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.borkdominik.big.glsp.server.core.features.tool_palette.BGBaseToolPaletteProvider;
import com.borkdominik.big.glsp.server.core.features.tool_palette.BGPaletteItemUtil;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.unotation.Representation;

public class InformationFlowToolPaletteProvider extends BGBaseToolPaletteProvider {
   public InformationFlowToolPaletteProvider() {
      super(Representation.INFORMATION_FLOW);
   }

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return List.of(containers(), edges());
   }

   private PaletteItem containers() {
      var containers = List.of(
         BGPaletteItemUtil.node(UMLTypes.CLASS.prefix(representation), "Class", "uml-class-icon"),
         BGPaletteItemUtil.node(UMLTypes.ACTOR.prefix(representation), "Actor", "uml-actor-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Containers", containers, "symbol-property");
   }

   private PaletteItem edges() {
      var edges = List.of(BGPaletteItemUtil.edge(UMLTypes.INFORMATION_FLOW.prefix(representation), "Information Flow",
         "uml-dependency-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Edges", edges, "symbol-property");
   }
}
