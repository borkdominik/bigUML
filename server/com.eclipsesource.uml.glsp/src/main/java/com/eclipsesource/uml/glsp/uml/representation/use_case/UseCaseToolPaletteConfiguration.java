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
package com.eclipsesource.uml.glsp.uml.representation.use_case;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;
import org.eclipse.uml2.uml.Actor;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Component;
import org.eclipse.uml2.uml.Extend;
import org.eclipse.uml2.uml.Generalization;
import org.eclipse.uml2.uml.Include;
import org.eclipse.uml2.uml.UseCase;

import com.eclipsesource.uml.glsp.core.features.tool_palette.PaletteItemUtil;
import com.eclipsesource.uml.glsp.uml.features.tool_palette.RepresentationToolPaletteConfiguration;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class UseCaseToolPaletteConfiguration extends RepresentationToolPaletteConfiguration {
   public UseCaseToolPaletteConfiguration() {
      super(Representation.USE_CASE);
   }

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return List.of(containers(), relations());
   }

   protected PaletteItem containers() {
      var containers = List.of(
         PaletteItemUtil.node(configurationFor(UseCase.class).typeId(), "Usecase", "uml-use-case-icon"),
         PaletteItemUtil.node(configurationFor(Actor.class).typeId(), "Actor", "uml-actor-icon"),
         PaletteItemUtil.node(configurationFor(Component.class).typeId(), "Subject", "uml-component-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Container", containers, "symbol-property");
   }

   protected PaletteItem relations() {
      var relations = List.of(
         PaletteItemUtil.edge(configurationFor(Include.class).typeId(), "Include", "uml-include-icon"),
         PaletteItemUtil.edge(configurationFor(Association.class).typeId(), "Association",
            "uml-association-none-icon"),
         PaletteItemUtil.edge(configurationFor(Generalization.class).typeId(), "Generalization",
            "uml-generalization-icon"),
         PaletteItemUtil.edge(configurationFor(Extend.class).typeId(), "Extend", "uml-extend-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Relation", relations, "symbol-property");
   }
}
