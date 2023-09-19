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
package com.eclipsesource.uml.glsp.uml.representation.communication;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.Message;

import com.eclipsesource.uml.glsp.core.features.tool_palette.PaletteItemUtil;
import com.eclipsesource.uml.glsp.uml.features.tool_palette.RepresentationToolPaletteConfiguration;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.common.collect.Lists;

public class CommunicationToolPaletteConfiguration extends RepresentationToolPaletteConfiguration {
   public CommunicationToolPaletteConfiguration() {
      super(Representation.COMMUNICATION);
   }

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return Lists.newArrayList(nodes(), edges());
   }

   private PaletteItem nodes() {
      PaletteItem createInteraction = PaletteItemUtil.node(configurationFor(Interaction.class).typeId(), "Interaction",
         "uml-interaction-icon");
      PaletteItem createLifeline = PaletteItemUtil.node(configurationFor(Lifeline.class).typeId(), "Lifeline",
         "uml-lifeline-icon");

      List<PaletteItem> classifiers = Lists.newArrayList(createInteraction, createLifeline);
      return PaletteItem.createPaletteGroup("uml.classifier", "Nodes", classifiers, "versions");
   }

   private PaletteItem edges() {
      PaletteItem createAssociation = PaletteItemUtil.edge(configurationFor(Message.class).typeId(), "Message",
         "uml-message-icon");

      List<PaletteItem> edges = Lists.newArrayList(createAssociation);
      return PaletteItem.createPaletteGroup("uml.relation", "Edges", edges, "export");
   }

}
