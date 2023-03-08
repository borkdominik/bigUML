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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.features.tool_palette;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.eclipsesource.uml.glsp.core.features.tool_palette.PaletteItemUtil;
import com.eclipsesource.uml.glsp.core.features.tool_palette.ToolPaletteConfiguration;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Abstraction;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Association;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Class;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_DataType;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Dependency;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Enumeration;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_EnumerationLiteral;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Generalization;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Interface;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_InterfaceRealization;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Operation;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Package;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_PackageImport;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_PackageMerge;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_PrimitiveType;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Property;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Realization;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Substitution;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Usage;

public final class ClassToolPaletteConfiguration implements ToolPaletteConfiguration {
   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return List.of(containers(), relations(), features());
   }

   private PaletteItem containers() {
      var containers = List.of(
         PaletteItemUtil.node(UmlClass_Class.typeId(), "Class", "uml-class-icon"),
         PaletteItemUtil.node(UmlClass_Class.Variant.abstractTypeId(), "Abstract Class", "uml-class-icon"),
         PaletteItemUtil.node(UmlClass_Interface.typeId(), "Interface", "uml-interface-icon"),
         PaletteItemUtil.node(UmlClass_Enumeration.typeId(), "Enumeration", "uml-enumeration-icon"),
         PaletteItemUtil.node(UmlClass_DataType.typeId(), "Data Type", "uml-data-type-icon"),
         PaletteItemUtil.node(UmlClass_PrimitiveType.typeId(), "Primitive Type", "uml-primitive-type-icon"),
         PaletteItemUtil.node(UmlClass_Package.typeId(), "Package", "uml-package-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Container", containers, "symbol-property");
   }

   private PaletteItem relations() {
      var relations = List.of(
         PaletteItemUtil.edge(UmlClass_Abstraction.typeId(), "Abstraction", "uml-abstraction-icon"),
         PaletteItemUtil.edge(UmlClass_Association.typeId(), "Association",
            "uml-association-none-icon"),
         PaletteItemUtil.edge(UmlClass_Association.Variant.compositionTypeId(), "Composition",
            "uml-association-composite-icon"),
         PaletteItemUtil.edge(UmlClass_Association.Variant.aggregationTypeId(), "Aggregation",
            "uml-association-shared-icon"),
         PaletteItemUtil.edge(UmlClass_Dependency.typeId(), "Dependency", "uml-dependency-icon"),
         PaletteItemUtil.edge(UmlClass_Generalization.typeId(), "Generalization", "uml-generalization-icon"),
         PaletteItemUtil.edge(UmlClass_InterfaceRealization.typeId(), "Interface Realization",
            "uml-interface-realization-icon"),
         PaletteItemUtil.edge(UmlClass_PackageImport.typeId(), "Package Import", "uml-package-import-icon"),
         PaletteItemUtil.edge(UmlClass_PackageMerge.typeId(), "Package Merge", "uml-package-merge-icon"),
         PaletteItemUtil.edge(UmlClass_Realization.typeId(), "Realization", "uml-realization-icon"),
         PaletteItemUtil.edge(UmlClass_Substitution.typeId(), "Substitution", "uml-substitution-icon"),
         PaletteItemUtil.edge(UmlClass_Usage.typeId(), "Usage", "uml-usage-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Relation", relations, "symbol-property");
   }

   private PaletteItem features() {
      var features = List.of(
         PaletteItemUtil.node(UmlClass_Property.typeId(), "Property", "uml-property-icon"),
         PaletteItemUtil.node(UmlClass_EnumerationLiteral.typeId(), "Enumeration Literal",
            "uml-enumeration-literal-icon"),
         PaletteItemUtil.node(UmlClass_Operation.typeId(), "Operation", "uml-operation-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Feature", features, "symbol-property");
   }
}
