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
package com.eclipsesource.uml.glsp.uml.representation.information_flow;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;
import org.eclipse.uml2.uml.Actor;
import org.eclipse.uml2.uml.InformationFlow;

import com.eclipsesource.uml.glsp.core.features.tool_palette.PaletteItemUtil;
import com.eclipsesource.uml.glsp.uml.features.tool_palette.RepresentationToolPaletteConfiguration;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class InformationFlowToolPaletteConfiguration extends RepresentationToolPaletteConfiguration {
   public InformationFlowToolPaletteConfiguration() {
      super(Representation.INFORMATION_FLOW);
   }

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return List.of(containers(), edges());
   }

   private PaletteItem containers() {
      var containers = List.of(
         PaletteItemUtil.node(configurationFor(org.eclipse.uml2.uml.Class.class).typeId(), "Class", "uml-class-icon"),
         PaletteItemUtil.node(configurationFor(Actor.class).typeId(), "Actor", "uml-actor-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Containers", containers, "symbol-property");
   }

   private PaletteItem edges() {
      var edges = List.of(PaletteItemUtil.edge(configurationFor(InformationFlow.class).typeId(), "Information Flow",
         "uml-dependency-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Edges", edges, "symbol-property");
   }
}
