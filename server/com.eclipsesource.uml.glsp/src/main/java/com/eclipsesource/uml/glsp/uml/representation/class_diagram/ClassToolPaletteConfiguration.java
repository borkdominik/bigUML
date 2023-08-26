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
package com.eclipsesource.uml.glsp.uml.representation.class_diagram;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;
import org.eclipse.uml2.uml.Abstraction;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.DataType;
import org.eclipse.uml2.uml.Dependency;
import org.eclipse.uml2.uml.Enumeration;
import org.eclipse.uml2.uml.EnumerationLiteral;
import org.eclipse.uml2.uml.Generalization;
import org.eclipse.uml2.uml.Interface;
import org.eclipse.uml2.uml.InterfaceRealization;
import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.PackageImport;
import org.eclipse.uml2.uml.PackageMerge;
import org.eclipse.uml2.uml.PrimitiveType;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.Realization;
import org.eclipse.uml2.uml.Substitution;
import org.eclipse.uml2.uml.Usage;

import com.eclipsesource.uml.glsp.core.features.tool_palette.PaletteItemUtil;
import com.eclipsesource.uml.glsp.uml.elements.association.AssociationConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.class_.ClassConfiguration;
import com.eclipsesource.uml.glsp.uml.features.tool_palette.RepresentationToolPaletteConfiguration;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public final class ClassToolPaletteConfiguration extends RepresentationToolPaletteConfiguration {
   public ClassToolPaletteConfiguration() {
      super(Representation.CLASS);
   }

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return List.of(containers(), relations(), features());
   }

   private PaletteItem containers() {
      var containers = List.of(
         PaletteItemUtil.node(configurationFor(org.eclipse.uml2.uml.Class.class).typeId(), "Class", "uml-class-icon"),
         PaletteItemUtil.node(
            configurationFor(org.eclipse.uml2.uml.Class.class, ClassConfiguration.class).abstractTypeId(),
            "Abstract Class", "uml-class-icon"),
         PaletteItemUtil.node(configurationFor(Interface.class).typeId(), "Interface", "uml-interface-icon"),
         PaletteItemUtil.node(configurationFor(Enumeration.class).typeId(), "Enumeration", "uml-enumeration-icon"),
         PaletteItemUtil.node(configurationFor(DataType.class).typeId(), "Data Type", "uml-data-type-icon"),
         PaletteItemUtil.node(configurationFor(PrimitiveType.class).typeId(), "Primitive Type",
            "uml-primitive-type-icon"),
         PaletteItemUtil.node(configurationFor(org.eclipse.uml2.uml.Package.class).typeId(), "Package",
            "uml-package-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Container", containers, "symbol-property");
   }

   private PaletteItem relations() {
      var relations = List.of(
         PaletteItemUtil.edge(configurationFor(Abstraction.class).typeId(), "Abstraction", "uml-abstraction-icon"),
         PaletteItemUtil.edge(configurationFor(Association.class).typeId(), "Association",
            "uml-association-none-icon"),
         PaletteItemUtil.edge(configurationFor(Association.class, AssociationConfiguration.class).compositionTypeId(),
            "Composition",
            "uml-association-composite-icon"),
         PaletteItemUtil.edge(configurationFor(Association.class, AssociationConfiguration.class).aggregationTypeId(),
            "Aggregation",
            "uml-association-shared-icon"),
         PaletteItemUtil.edge(configurationFor(Dependency.class).typeId(), "Dependency", "uml-dependency-icon"),
         PaletteItemUtil.edge(configurationFor(Generalization.class).typeId(), "Generalization",
            "uml-generalization-icon"),
         PaletteItemUtil.edge(configurationFor(InterfaceRealization.class).typeId(), "Interface Realization",
            "uml-interface-realization-icon"),
         PaletteItemUtil.edge(configurationFor(PackageImport.class).typeId(), "Package Import",
            "uml-package-import-icon"),
         PaletteItemUtil.edge(configurationFor(PackageMerge.class).typeId(), "Package Merge", "uml-package-merge-icon"),
         PaletteItemUtil.edge(configurationFor(Realization.class).typeId(), "Realization", "uml-realization-icon"),
         PaletteItemUtil.edge(configurationFor(Substitution.class).typeId(), "Substitution", "uml-substitution-icon"),
         PaletteItemUtil.edge(configurationFor(Usage.class).typeId(), "Usage", "uml-usage-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Relation", relations, "symbol-property");
   }

   private PaletteItem features() {
      var features = List.of(
         PaletteItemUtil.node(configurationFor(Property.class).typeId(), "Property", "uml-property-icon"),
         PaletteItemUtil.node(configurationFor(EnumerationLiteral.class).typeId(), "Enumeration Literal",
            "uml-enumeration-literal-icon"),
         PaletteItemUtil.node(configurationFor(Operation.class).typeId(), "Operation", "uml-operation-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Feature", features, "symbol-property");
   }
}
