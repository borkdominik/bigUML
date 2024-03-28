/********************************************************************************
 * Copyright (c) 2022 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.representation.class_;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.borkdominik.big.glsp.server.core.features.tool_palette.BGBaseToolPaletteProvider;
import com.borkdominik.big.glsp.server.core.features.tool_palette.BGPaletteItemUtil;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.unotation.Representation;

public final class ClassToolPaletteProvider extends BGBaseToolPaletteProvider {
   public ClassToolPaletteProvider() {
      super(Representation.CLASS);
   }

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      var containers = List.of(
         BGPaletteItemUtil.node(UMLTypes.ABSTRACT_CLASS.prefix(representation), "Abstract Class", "uml-class-icon"),
         BGPaletteItemUtil.node(UMLTypes.CLASS.prefix(representation), "Class", "uml-class-icon"),
         BGPaletteItemUtil.node(UMLTypes.ENUMERATION.prefix(representation), "Enumeration", "uml-enumeration-icon"),
         BGPaletteItemUtil.node(UMLTypes.DATA_TYPE.prefix(representation), "Data Type", "uml-data-type-icon"),
         BGPaletteItemUtil.node(UMLTypes.INTERFACE.prefix(representation), "Interface", "uml-interface-icon"),
         BGPaletteItemUtil.node(UMLTypes.PACKAGE.prefix(representation), "Package", "uml-package-icon"),
         BGPaletteItemUtil.node(UMLTypes.PRIMITIVE_TYPE.prefix(representation), "Primitive Type",
            "uml-primitive-type-icon"));

      var features = List.of(
         BGPaletteItemUtil.node(UMLTypes.PROPERTY.prefix(representation), "Property", "uml-property-icon"),
         BGPaletteItemUtil.node(UMLTypes.ENUMERATION_LITERAL.prefix(representation), "Enumeration Literal",
            "uml-enumeration-literal-icon"),
         BGPaletteItemUtil.node(UMLTypes.OPERATION.prefix(representation), "Operation", "uml-operation-icon"),
         BGPaletteItemUtil.node(UMLTypes.SLOT.prefix(representation), "Slot",
            "uml-slot-icon"));

      var edges = List.of(
         BGPaletteItemUtil.edge(UMLTypes.ABSTRACTION.prefix(representation), "Abstraction", "uml-abstraction-icon"),
         BGPaletteItemUtil.edge(UMLTypes.ASSOCIATION.prefix(representation), "Association",
            "uml-association-none-icon"),
         BGPaletteItemUtil.edge(UMLTypes.COMPOSITION.prefix(representation),
            "Composition",
            "uml-association-composite-icon"),
         BGPaletteItemUtil.edge(UMLTypes.AGGREGATION.prefix(representation),
            "Aggregation",
            "uml-association-shared-icon"),
         BGPaletteItemUtil.edge(UMLTypes.DEPENDENCY.prefix(representation), "Dependency", "uml-dependency-icon"),
         BGPaletteItemUtil.edge(UMLTypes.ELEMENT_IMPORT.prefix(representation), "Element Import",
            "uml-package-import-icon"),
         BGPaletteItemUtil.edge(UMLTypes.GENERALIZATION.prefix(representation), "Generalization",
            "uml-generalization-icon"),
         BGPaletteItemUtil.edge(UMLTypes.INTERFACE_REALIZATION.prefix(representation), "Interface Realization",
            "uml-interface-realization-icon"),
         BGPaletteItemUtil.edge(UMLTypes.PACKAGE_IMPORT.prefix(representation), "Package Import",
            "uml-package-import-icon"),
         BGPaletteItemUtil.edge(UMLTypes.PACKAGE_MERGE.prefix(representation), "Package Merge",
            "uml-package-merge-icon"),
         BGPaletteItemUtil.edge(UMLTypes.REALIZATION.prefix(representation), "Realization", "uml-realization-icon"),
         BGPaletteItemUtil.edge(UMLTypes.SUBSTITUTION.prefix(representation), "Substitution", "uml-substitution-icon"),
         BGPaletteItemUtil.edge(UMLTypes.USAGE.prefix(representation), "Usage", "uml-usage-icon"));

      return List.of(
         PaletteItem.createPaletteGroup("uml.palette-container", "Container", containers, "symbol-property"),
         PaletteItem.createPaletteGroup("uml.palette-features", "Feature", features, "symbol-property"),
         PaletteItem.createPaletteGroup("uml.palette-edges", "Relations", edges, "symbol-property"));
   }
}
