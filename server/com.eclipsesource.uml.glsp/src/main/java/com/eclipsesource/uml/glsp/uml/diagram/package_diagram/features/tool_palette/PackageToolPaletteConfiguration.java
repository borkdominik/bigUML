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
package com.eclipsesource.uml.glsp.uml.diagram.package_diagram.features.tool_palette;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.eclipsesource.uml.glsp.core.features.tool_palette.PaletteItemUtil;
import com.eclipsesource.uml.glsp.core.features.tool_palette.ToolPaletteConfiguration;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.diagram.UmlPackage_Class;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.diagram.UmlPackage_Dependency;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.diagram.UmlPackage_ElementImport;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.diagram.UmlPackage_Package;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.diagram.UmlPackage_PackageImport;
import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.diagram.UmlPackage_PackageMerge;

public class PackageToolPaletteConfiguration implements ToolPaletteConfiguration {
   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return List.of(containers(), relations());
   }

   private PaletteItem containers() {
      var containers = List.of(
         PaletteItemUtil.node(UmlPackage_Package.typeId(), "Package", "uml-package-icon"),
         PaletteItemUtil.node(UmlPackage_Class.typeId(), "Class", "uml-class-icon"));
      return PaletteItem.createPaletteGroup("uml.classifier", "Container", containers, "symbol-property");
   }

   private PaletteItem relations() {
      var relations = List.of(
         PaletteItemUtil.edge(UmlPackage_Dependency.typeId(), "Dependency", "uml-dependency-icon"),
         PaletteItemUtil.edge(UmlPackage_PackageImport.typeId(), "Package Import", "uml-package-import-icon"),
         PaletteItemUtil.edge(UmlPackage_PackageMerge.typeId(), "Package Merge", "uml-package-merge-icon"),
         PaletteItemUtil.edge(UmlPackage_ElementImport.typeId(), "Element Import", "uml-package-import-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Relation", relations, "symbol-property");
   }
}
