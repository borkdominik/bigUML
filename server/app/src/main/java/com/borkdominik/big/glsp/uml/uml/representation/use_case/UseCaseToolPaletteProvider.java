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
package com.borkdominik.big.glsp.uml.uml.representation.use_case;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.borkdominik.big.glsp.server.core.features.tool_palette.BGBaseToolPaletteProvider;
import com.borkdominik.big.glsp.server.core.features.tool_palette.BGPaletteItemUtil;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.unotation.Representation;

public class UseCaseToolPaletteProvider extends BGBaseToolPaletteProvider {
   public UseCaseToolPaletteProvider() {
      super(Representation.USE_CASE);
   }

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return List.of(containers(), relations());
   }

   protected PaletteItem containers() {
      var containers = List.of(
         BGPaletteItemUtil.node(UMLTypes.USE_CASE.prefix(representation), "Usecase", "uml-use-case-icon"),
         BGPaletteItemUtil.node(UMLTypes.ACTOR.prefix(representation), "Actor", "uml-actor-icon"),
         BGPaletteItemUtil.node(UMLTypes.COMPONENT.prefix(representation), "Subject", "uml-component-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Container", containers, "symbol-property");
   }

   protected PaletteItem relations() {
      var relations = List.of(
         BGPaletteItemUtil.edge(UMLTypes.INCLUDE.prefix(representation), "Include", "uml-include-icon"),
         BGPaletteItemUtil.edge(UMLTypes.ASSOCIATION.prefix(representation), "Association",
            "uml-association-none-icon"),
         BGPaletteItemUtil.edge(UMLTypes.GENERALIZATION.prefix(representation), "Generalization",
            "uml-generalization-icon"),
         BGPaletteItemUtil.edge(UMLTypes.EXTEND.prefix(representation), "Extend", "uml-extend-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Relation", relations, "symbol-property");
   }
}
