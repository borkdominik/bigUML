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
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_PrimitiveType;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Property;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Realization;

public final class ClassToolPaletteConfiguration implements ToolPaletteConfiguration {
   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return List.of(containers(), relations(), features());
   }

   private PaletteItem containers() {
      var containers = List.of(
         PaletteItemUtil.node(UmlClass_Class.TYPE_ID, "Class", "umlclass"),
         PaletteItemUtil.node(UmlClass_AbstractClass.TYPE_ID, "Abstract Class", "umlclass"),
         PaletteItemUtil.node(UmlClass_Interface.TYPE_ID, "Interface", "umlclass"),
         PaletteItemUtil.node(UmlClass_Enumeration.TYPE_ID, "Enumeration", "umlenumeration"),
         PaletteItemUtil.node(UmlClass_DataType.TYPE_ID, "Data Type", "umldatatype"),
         PaletteItemUtil.node(UmlClass_PrimitiveType.TYPE_ID, "Primitive Type", "umlprimitivetype"),
         PaletteItemUtil.node(UmlClass_Package.TYPE_ID, "Package", "umlpackage"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Container", containers, "symbol-property");
   }

   private PaletteItem relations() {
      var relations = List.of(
         PaletteItemUtil.edge(UmlClass_Abstraction.TYPE_ID, "Abstraction", "umlabstraction"),
         PaletteItemUtil.edge(UmlClass_Association.ASSOCIATION_TYPE_ID, "Association", "umlassociation"),
         PaletteItemUtil.edge(UmlClass_Association.COMPOSITION_TYPE_ID, "Composition", "umlassociation"),
         PaletteItemUtil.edge(UmlClass_Association.AGGREGATION_TYPE_ID, "Aggregation", "umlassociation"),
         PaletteItemUtil.edge(UmlClass_Dependency.TYPE_ID, "Dependency", "umldependency"),
         PaletteItemUtil.edge(UmlClass_Generalization.TYPE_ID, "Generalization", "umlgeneralization"),
         PaletteItemUtil.edge(UmlClass_InterfaceRealization.TYPE_ID, "Interface Realization",
            "umlinterfacerealization"),
         PaletteItemUtil.edge(UmlClass_Realization.TYPE_ID, "Realization",
            "umlrealization"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Relation", relations, "symbol-property");
   }

   private PaletteItem features() {
      var features = List.of(
         PaletteItemUtil.node(UmlClass_Property.TYPE_ID, "Property", "umlproperty"),
         PaletteItemUtil.node(UmlClass_EnumerationLiteral.TYPE_ID, "Enumeration Literal", "umlliteral"),
         PaletteItemUtil.node(UmlClass_Operation.TYPE_ID, "Operation", "umloperation"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Feature", features, "symbol-property");
   }
}
