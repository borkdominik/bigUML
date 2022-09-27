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
package com.eclipsesource.uml.glsp.uml.communication_diagram.palette;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.eclipsesource.uml.glsp.palette.DiagramPalette;
import com.eclipsesource.uml.glsp.uml.communication_diagram.constants.CommunicationConfig;
import com.eclipsesource.uml.glsp.util.UmlPaletteUtil;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.common.collect.Lists;

public class CommunicationPalette implements DiagramPalette {

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return Lists.newArrayList(nodes(), edges());
   }

   private PaletteItem nodes() {
      PaletteItem createInteraction = UmlPaletteUtil.node(CommunicationConfig.Types.INTERACTION, "Interaction",
         "umlInteraction");
      PaletteItem createLifeline = UmlPaletteUtil.node(CommunicationConfig.Types.LIFELINE, "Lifeline", "umlLifeline");

      List<PaletteItem> classifiers = Lists.newArrayList(createInteraction, createLifeline);
      return PaletteItem.createPaletteGroup("uml.classifier", "Nodes", classifiers, "versions");
   }

   private PaletteItem edges() {
      PaletteItem createAssociation = UmlPaletteUtil.edge(CommunicationConfig.Types.MESSAGE, "Message", "umlMessage");

      List<PaletteItem> edges = Lists.newArrayList(createAssociation);
      return PaletteItem.createPaletteGroup("uml.relation", "Edges", edges, "export");
   }

   @Override
   public boolean supports(final Representation representation) {
      return representation == Representation.COMMUNICATION;
   }

}
