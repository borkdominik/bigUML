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
import com.google.common.collect.Lists;

public class ClassPalette implements DiagramPalette {
   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return Lists.newArrayList(classifiersClass(), relationsClass(), featuresClass());
   }

   private PaletteItem classifiersClass() {
      PaletteItem createClass = PaletteItemUtil.node(ClassTypes.CLASS, "Class", "umlclass");
      PaletteItem createAbstractClass = PaletteItemUtil.node(ClassTypes.ABSTRACT_CLASS, "Abstract Class", "umlclass");
      // TODO: change icon
      PaletteItem createInterface = PaletteItemUtil.node(ClassTypes.INTERFACE, "Interface", "umlclass");
      PaletteItem createEnumeration = PaletteItemUtil.node(ClassTypes.ENUMERATION, "Enumeration", "umlenumeration");

      List<PaletteItem> classifiers = Lists.newArrayList(createClass, createAbstractClass, createInterface,
         createEnumeration);
      return PaletteItem.createPaletteGroup("uml.classifier", "Container", classifiers, "symbol-property");
   }

   private PaletteItem relationsClass() {
      PaletteItem createAssociation = PaletteItemUtil.edge(ClassTypes.ASSOCIATION, "Association", "umlassociation");
      PaletteItem createGeneralisation = PaletteItemUtil.edge(ClassTypes.CLASS_GENERALIZATION, "Generalization",
         "umlgeneralization");
      PaletteItem createComposition = PaletteItemUtil.edge(ClassTypes.COMPOSITION, "Composition", "umlassociation");
      PaletteItem createAggregation = PaletteItemUtil.edge(ClassTypes.AGGREGATION, "Aggregation", "umlassociation");

      List<PaletteItem> relations = Lists.newArrayList(createAssociation, createGeneralisation, createComposition,
         createAggregation);
      return PaletteItem.createPaletteGroup("uml.classifier", "Relation", relations, "symbol-property");
   }

   private PaletteItem featuresClass() {
      PaletteItem createProperty = PaletteItemUtil.node(ClassTypes.PROPERTY, "Property", "umlproperty");

      List<PaletteItem> features = Lists.newArrayList(createProperty);
      return PaletteItem.createPaletteGroup("uml.classifier", "Feature", features, "symbol-property");
   }
}
