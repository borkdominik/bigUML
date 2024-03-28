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
package com.borkdominik.big.glsp.uml.uml.representation.package_;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.borkdominik.big.glsp.server.core.features.tool_palette.BGBaseToolPaletteProvider;
import com.borkdominik.big.glsp.server.core.features.tool_palette.BGPaletteItemUtil;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.unotation.Representation;

public class PackageToolPaletteProvider extends BGBaseToolPaletteProvider {
   public PackageToolPaletteProvider() {
      super(Representation.PACKAGE);
   }

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return List.of(containers(), relations());
   }

   private PaletteItem containers() {
      var containers = List.of(
         BGPaletteItemUtil.node(UMLTypes.PACKAGE.prefix(representation), "Package",
            "uml-package-icon"),
         BGPaletteItemUtil.node(UMLTypes.CLASS.prefix(representation), "Class",
            "uml-class-icon"));
      return PaletteItem.createPaletteGroup("uml.classifier", "Container", containers, "symbol-property");
   }

   private PaletteItem relations() {
      var relations = List.of(
         BGPaletteItemUtil.edge(UMLTypes.USAGE.prefix(representation), "Usage", "uml-usage-icon"),
         BGPaletteItemUtil.edge(UMLTypes.ABSTRACTION.prefix(representation), "Abstraction", "uml-abstraction-icon"),
         BGPaletteItemUtil.edge(UMLTypes.DEPENDENCY.prefix(representation), "Dependency", "uml-dependency-icon"),
         BGPaletteItemUtil.edge(UMLTypes.PACKAGE_IMPORT.prefix(representation), "Package Import",
            "uml-package-import-icon"),
         BGPaletteItemUtil.edge(UMLTypes.PACKAGE_MERGE.prefix(representation), "Package Merge",
            "uml-package-merge-icon"),
         BGPaletteItemUtil.edge(UMLTypes.ELEMENT_IMPORT.prefix(representation), "Element Import",
            "uml-package-import-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Relation", relations, "symbol-property");
   }
}
