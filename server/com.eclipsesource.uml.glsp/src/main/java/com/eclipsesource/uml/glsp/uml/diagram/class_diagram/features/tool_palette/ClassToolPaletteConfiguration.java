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
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_AbstractClass;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Abstraction;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Association;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Class;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_DataType;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Dependency;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Enumeration;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_EnumerationLiteral;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Generalization;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Interface;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_InterfaceRealization;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Operation;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Package;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_PackageImport;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_PackageMerge;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_PrimitiveType;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Property;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Realization;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Substitution;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Usage;

public final class ClassToolPaletteConfiguration implements ToolPaletteConfiguration {
   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return List.of(containers(), relations(), features());
   }

   private PaletteItem containers() {
      var containers = List.of(
         PaletteItemUtil.node(UmlClass_Class.TYPE_ID, "Class", "uml-class-icon"),
         PaletteItemUtil.node(UmlClass_AbstractClass.TYPE_ID, "Abstract Class", "uml-class-icon"),
         PaletteItemUtil.node(UmlClass_Interface.TYPE_ID, "Interface", "uml-interface-icon"),
         PaletteItemUtil.node(UmlClass_Enumeration.TYPE_ID, "Enumeration", "uml-enumeration-icon"),
         PaletteItemUtil.node(UmlClass_DataType.TYPE_ID, "Data Type", "uml-data-type-icon"),
         PaletteItemUtil.node(UmlClass_PrimitiveType.TYPE_ID, "Primitive Type", "uml-primitive-type-icon"),
         PaletteItemUtil.node(UmlClass_Package.TYPE_ID, "Package", "uml-package-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Container", containers, "symbol-property");
   }

   private PaletteItem relations() {
      var relations = List.of(
         PaletteItemUtil.edge(UmlClass_Abstraction.TYPE_ID, "Abstraction", "uml-abstraction-icon"),
         PaletteItemUtil.edge(UmlClass_Association.ASSOCIATION_TYPE_ID, "Association", "uml-association-none-icon"),
         PaletteItemUtil.edge(UmlClass_Association.COMPOSITION_TYPE_ID, "Composition",
            "uml-association-composite-icon"),
         PaletteItemUtil.edge(UmlClass_Association.AGGREGATION_TYPE_ID, "Aggregation", "uml-association-shared-icon"),
         PaletteItemUtil.edge(UmlClass_Dependency.TYPE_ID, "Dependency", "uml-dependency-icon"),
         PaletteItemUtil.edge(UmlClass_Generalization.TYPE_ID, "Generalization", "uml-generalization-icon"),
         PaletteItemUtil.edge(UmlClass_InterfaceRealization.TYPE_ID, "Interface Realization",
            "uml-interface-realization-icon"),
         PaletteItemUtil.edge(UmlClass_PackageImport.TYPE_ID, "Package Import", "uml-package-import-icon"),
         PaletteItemUtil.edge(UmlClass_PackageMerge.TYPE_ID, "Package Merge", "uml-package-merge-icon"),
         PaletteItemUtil.edge(UmlClass_Realization.TYPE_ID, "Realization", "uml-realization-icon"),
         PaletteItemUtil.edge(UmlClass_Substitution.TYPE_ID, "Substitution", "uml-substitution-icon"),
         PaletteItemUtil.edge(UmlClass_Usage.TYPE_ID, "Usage", "uml-usage-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Relation", relations, "symbol-property");
   }

   private PaletteItem features() {
      var features = List.of(
         PaletteItemUtil.node(UmlClass_Property.TYPE_ID, "Property", "uml-property-icon"),
         PaletteItemUtil.node(UmlClass_EnumerationLiteral.TYPE_ID, "Enumeration Literal",
            "uml-enumeration-literal-icon"),
         PaletteItemUtil.node(UmlClass_Operation.TYPE_ID, "Operation", "uml-operation-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Feature", features, "symbol-property");
   }
}
