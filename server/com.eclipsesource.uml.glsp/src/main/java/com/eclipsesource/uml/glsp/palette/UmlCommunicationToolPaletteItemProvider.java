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
package com.eclipsesource.uml.glsp.palette;

import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.eclipse.glsp.server.actions.TriggerEdgeCreationAction;
import org.eclipse.glsp.server.actions.TriggerNodeCreationAction;
import org.eclipse.glsp.server.features.toolpalette.PaletteItem;
import org.eclipse.glsp.server.features.toolpalette.ToolPaletteItemProvider;

import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.google.common.collect.Lists;

public class UmlCommunicationToolPaletteItemProvider implements ToolPaletteItemProvider {
   private static Logger LOGGER = Logger.getLogger(UmlCommunicationToolPaletteItemProvider.class.getSimpleName());

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      LOGGER.info("Create communication palette");

      return Lists.newArrayList(classifiers(), relations());
   }

   private PaletteItem classifiers() {
      PaletteItem createInteraction = node(Types.INTERACTION, "Interaction", "umlInteraction");
      PaletteItem createLifeline = node(Types.LIFELINE, "Lifeline", "umlLifeline");

      List<PaletteItem> classifiers = Lists.newArrayList(createInteraction, createLifeline);
      return PaletteItem.createPaletteGroup("uml.classifier", "Nodes", classifiers, "versions");
   }

   private PaletteItem relations() {
      PaletteItem createAssociation = edge(Types.MESSAGE, "Message", "umlMessage");

      List<PaletteItem> edges = Lists.newArrayList(createAssociation);
      return PaletteItem.createPaletteGroup("uml.relation", "Edges", edges, "export");
   }

   private PaletteItem node(final String elementTypeId, final String label, final String icon) {
      return new PaletteItem(elementTypeId, label, new TriggerNodeCreationAction(elementTypeId), icon);
   }

   private PaletteItem edge(final String elementTypeId, final String label, final String icon) {
      return new PaletteItem(elementTypeId, label, new TriggerEdgeCreationAction(elementTypeId), icon);
   }
}
