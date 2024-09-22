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
package com.borkdominik.big.glsp.uml.uml.representation.communication;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.borkdominik.big.glsp.server.core.features.tool_palette.BGBaseToolPaletteProvider;
import com.borkdominik.big.glsp.server.core.features.tool_palette.BGPaletteItemUtil;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.unotation.Representation;

public class CommunicationToolPaletteProvider extends BGBaseToolPaletteProvider {
   public CommunicationToolPaletteProvider() {
      super(Representation.COMMUNICATION);
   }

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return List.of(containers(), edges());
   }

   private PaletteItem containers() {
      var containers = List.of(
         BGPaletteItemUtil.node(UMLTypes.INTERACTION.prefix(representation), "Interaction", "uml-interaction-icon"),
         BGPaletteItemUtil.node(UMLTypes.LIFELINE.prefix(representation), "Lifeline", "uml-lifeline-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Containers", containers, "symbol-property");
   }

   private PaletteItem edges() {
      var edges = List.of(BGPaletteItemUtil.edge(UMLTypes.MESSAGE.prefix(representation), "Message",
         "uml-message-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Edges", edges, "symbol-property");
   }

}
