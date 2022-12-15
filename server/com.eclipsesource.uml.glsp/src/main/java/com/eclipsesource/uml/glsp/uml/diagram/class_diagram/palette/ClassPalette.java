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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.palette;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.eclipsesource.uml.glsp.core.features.toolpalette.DiagramPalette;
import com.eclipsesource.uml.glsp.core.features.toolpalette.PaletteItemUtil;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.ClassTypes;

public class ClassPalette implements DiagramPalette {
   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return List.of(containers(), relations(), features());
   }

   private PaletteItem containers() {
      var containers = List.of(
         PaletteItemUtil.node(ClassTypes.CLASS, "Class", "umlclass"),
         PaletteItemUtil.node(ClassTypes.ABSTRACT_CLASS, "Abstract Class", "umlclass"),
         PaletteItemUtil.node(ClassTypes.INTERFACE, "Interface", "umlclass"),
         PaletteItemUtil.node(ClassTypes.ENUMERATION, "Enumeration", "umlenumeration"),
         PaletteItemUtil.node(ClassTypes.DATA_TYPE, "Data Type", "umldatatype"),
         PaletteItemUtil.node(ClassTypes.PRIMITIVE_TYPE, "Primitive Type", "umlprimitivetype"),
         PaletteItemUtil.node(ClassTypes.PACKAGE, "Package", "umlpackage"));
      return PaletteItem.createPaletteGroup("uml.classifier", "Container", containers, "symbol-property");
   }

   private PaletteItem relations() {
      var relations = List.of(
         PaletteItemUtil.edge(ClassTypes.ASSOCIATION, "Association", "umlassociation"),
         PaletteItemUtil.edge(ClassTypes.CLASS_GENERALIZATION, "Generalization",
            "umlgeneralization"),
         PaletteItemUtil.edge(ClassTypes.COMPOSITION, "Composition", "umlassociation"),
         PaletteItemUtil.edge(ClassTypes.AGGREGATION, "Aggregation", "umlassociation"));
      return PaletteItem.createPaletteGroup("uml.classifier", "Relation", relations, "symbol-property");
   }

   private PaletteItem features() {
      var features = List.of(
         PaletteItemUtil.node(ClassTypes.PROPERTY, "Property", "umlproperty"),
         PaletteItemUtil.node(ClassTypes.ENUMERATION_LITERAL, "Enumeration Literal", "umlliteral"),
         PaletteItemUtil.node(ClassTypes.OPERATION, "Operation", "umloperation"));
      return PaletteItem.createPaletteGroup("uml.classifier", "Feature", features, "symbol-property");
   }
}
