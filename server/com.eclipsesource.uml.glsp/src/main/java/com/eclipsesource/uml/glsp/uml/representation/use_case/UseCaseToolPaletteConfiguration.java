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

import com.eclipsesource.uml.glsp.core.features.tool_palette.PaletteItemUtil;
import com.eclipsesource.uml.glsp.core.features.tool_palette.ToolPaletteConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.actor.ActorConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.association.AssociationConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.extend.ExtendConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.generalization.GeneralizationConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.include.IncludeConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.subject.SubjectConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.usecase.UseCaseConfiguration;

public class UseCaseToolPaletteConfiguration implements ToolPaletteConfiguration {
   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return List.of(containers(), relations());
   }

   private PaletteItem containers() {
      var containers = List.of(
         PaletteItemUtil.node(UseCaseConfiguration.typeId(), "Usecase", "uml-use-case-icon"),
         PaletteItemUtil.node(ActorConfiguration.typeId(), "Actor", "uml-actor-icon"),
         PaletteItemUtil.node(SubjectConfiguration.typeId(), "Subject", "uml-component-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Container", containers, "symbol-property");
   }

   private PaletteItem relations() {
      var relations = List.of(
         PaletteItemUtil.edge(IncludeConfiguration.typeId(), "Include", "uml-include-icon"),
         PaletteItemUtil.edge(AssociationConfiguration.typeId(), "Association",
            "uml-association-none-icon"),
         PaletteItemUtil.edge(GeneralizationConfiguration.typeId(), "Generalization", "uml-generalization-icon"),
         PaletteItemUtil.edge(ExtendConfiguration.typeId(), "Extend", "uml-extend-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Relation", relations, "symbol-property");
   }
}
