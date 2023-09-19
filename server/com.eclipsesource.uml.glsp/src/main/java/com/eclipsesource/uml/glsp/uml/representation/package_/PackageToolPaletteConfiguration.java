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
package com.eclipsesource.uml.glsp.uml.representation.package_;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;
import org.eclipse.uml2.uml.Abstraction;
import org.eclipse.uml2.uml.Dependency;
import org.eclipse.uml2.uml.ElementImport;
import org.eclipse.uml2.uml.PackageImport;
import org.eclipse.uml2.uml.PackageMerge;
import org.eclipse.uml2.uml.Usage;

import com.eclipsesource.uml.glsp.core.features.tool_palette.PaletteItemUtil;
import com.eclipsesource.uml.glsp.uml.features.tool_palette.RepresentationToolPaletteConfiguration;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class PackageToolPaletteConfiguration extends RepresentationToolPaletteConfiguration {
   public PackageToolPaletteConfiguration() {
      super(Representation.PACKAGE);
   }

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return List.of(containers(), relations());
   }

   private PaletteItem containers() {
      var containers = List.of(
         PaletteItemUtil.node(configurationFor(org.eclipse.uml2.uml.Package.class).typeId(), "Package",
            "uml-package-icon"),
         PaletteItemUtil.node(configurationFor(org.eclipse.uml2.uml.Class.class).typeId(), "Class", "uml-class-icon"));
      return PaletteItem.createPaletteGroup("uml.classifier", "Container", containers, "symbol-property");
   }

   private PaletteItem relations() {
      var relations = List.of(
         PaletteItemUtil.edge(configurationFor(Usage.class).typeId(), "Usage", "uml-usage-icon"),
         PaletteItemUtil.edge(configurationFor(Abstraction.class).typeId(), "Abstraction", "uml-abstraction-icon"),
         PaletteItemUtil.edge(configurationFor(Dependency.class).typeId(), "Dependency", "uml-dependency-icon"),
         PaletteItemUtil.edge(configurationFor(PackageImport.class).typeId(), "Package Import",
            "uml-package-import-icon"),
         PaletteItemUtil.edge(configurationFor(PackageMerge.class).typeId(), "Package Merge", "uml-package-merge-icon"),
         PaletteItemUtil.edge(configurationFor(ElementImport.class).typeId(), "Element Import",
            "uml-package-import-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Relation", relations, "symbol-property");
   }
}
