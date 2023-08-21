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
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Generalization;

import com.eclipsesource.uml.glsp.core.features.tool_palette.PaletteItemUtil;
import com.eclipsesource.uml.glsp.uml.elements.abstraction.AbstractionConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.association.AssociationConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.class_.ClassConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.data_type.DataTypeConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.dependency.DependencyConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.enumeration.EnumerationConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.enumeration_literal.EnumerationLiteralConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.interface_.InterfaceConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.interface_realization.InterfaceRealizationConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.operation.OperationConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.package_.PackageConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.package_import.PackageImportConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.package_merge.PackageMergeConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.primitive_type.PrimitiveTypeConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.property.PropertyConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.realization.RealizationConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.substitution.SubstitutionConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.usage.UsageConfiguration;
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
         PaletteItemUtil.node(ClassConfiguration.typeId(), "Class", "uml-class-icon"),
         PaletteItemUtil.node(ClassConfiguration.Variant.abstractTypeId(), "Abstract Class", "uml-class-icon"),
         PaletteItemUtil.node(InterfaceConfiguration.typeId(), "Interface", "uml-interface-icon"),
         PaletteItemUtil.node(EnumerationConfiguration.typeId(), "Enumeration", "uml-enumeration-icon"),
         PaletteItemUtil.node(DataTypeConfiguration.typeId(), "Data Type", "uml-data-type-icon"),
         PaletteItemUtil.node(PrimitiveTypeConfiguration.typeId(), "Primitive Type", "uml-primitive-type-icon"),
         PaletteItemUtil.node(PackageConfiguration.typeId(), "Package", "uml-package-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Container", containers, "symbol-property");
   }

   private PaletteItem relations() {
      var relations = List.of(
         PaletteItemUtil.edge(AbstractionConfiguration.typeId(), "Abstraction", "uml-abstraction-icon"),
         PaletteItemUtil.edge(configurationFor(Association.class).typeId(), "Association",
            "uml-association-none-icon"),
         PaletteItemUtil.edge(AssociationConfiguration.Variant.compositionTypeId(), "Composition",
            "uml-association-composite-icon"),
         PaletteItemUtil.edge(AssociationConfiguration.Variant.aggregationTypeId(), "Aggregation",
            "uml-association-shared-icon"),
         PaletteItemUtil.edge(DependencyConfiguration.typeId(), "Dependency", "uml-dependency-icon"),
         PaletteItemUtil.edge(configurationFor(Generalization.class).typeId(), "Generalization",
            "uml-generalization-icon"),
         PaletteItemUtil.edge(InterfaceRealizationConfiguration.typeId(), "Interface Realization",
            "uml-interface-realization-icon"),
         PaletteItemUtil.edge(PackageImportConfiguration.typeId(), "Package Import", "uml-package-import-icon"),
         PaletteItemUtil.edge(PackageMergeConfiguration.typeId(), "Package Merge", "uml-package-merge-icon"),
         PaletteItemUtil.edge(RealizationConfiguration.typeId(), "Realization", "uml-realization-icon"),
         PaletteItemUtil.edge(SubstitutionConfiguration.typeId(), "Substitution", "uml-substitution-icon"),
         PaletteItemUtil.edge(UsageConfiguration.typeId(), "Usage", "uml-usage-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Relation", relations, "symbol-property");
   }

   private PaletteItem features() {
      var features = List.of(
         PaletteItemUtil.node(PropertyConfiguration.typeId(), "Property", "uml-property-icon"),
         PaletteItemUtil.node(EnumerationLiteralConfiguration.typeId(), "Enumeration Literal",
            "uml-enumeration-literal-icon"),
         PaletteItemUtil.node(OperationConfiguration.typeId(), "Operation", "uml-operation-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Feature", features, "symbol-property");
   }
}
