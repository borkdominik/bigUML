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
package com.eclipsesource.uml.glsp.old.diagram.class_diagram;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.actions.TriggerEdgeCreationAction;
import org.eclipse.glsp.server.actions.TriggerNodeCreationAction;
import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.eclipsesource.uml.glsp.old.diagram.class_diagram.constants.ClassTypes;
import com.google.common.collect.Lists;

public class ClassPalette {
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return Lists.newArrayList(classifiersClass(), relationsClass(), featuresClass());
   }

   private PaletteItem classifiersClass() {
      PaletteItem createClass = node(ClassTypes.CLASS, "Class", "umlclass");
      PaletteItem createAbstractClass = node(ClassTypes.ABSTRACT_CLASS, "Abstract Class", "umlclass");
      // TODO: change icon
      PaletteItem createInterface = node(ClassTypes.INTERFACE, "Interface", "umlclass");
      PaletteItem createEnumeration = node(ClassTypes.ENUMERATION, "Enumeration", "umlenumeration");

      List<PaletteItem> classifiers = Lists.newArrayList(createClass, createAbstractClass, createInterface,
         createEnumeration);
      return PaletteItem.createPaletteGroup("uml.classifier", "Container", classifiers, "symbol-property");
   }

   private PaletteItem relationsClass() {
      PaletteItem createAssociation = edge(ClassTypes.ASSOCIATION, "Association", "umlassociation");
      PaletteItem createGeneralisation = edge(ClassTypes.CLASS_GENERALIZATION, "Generalization", "umlgeneralization");
      PaletteItem createComposition = edge(ClassTypes.COMPOSITION, "Composition", "umlassociation");
      PaletteItem createAggregation = edge(ClassTypes.AGGREGATION, "Aggregation", "umlassociation");

      List<PaletteItem> relations = Lists.newArrayList(createAssociation, createGeneralisation, createComposition,
         createAggregation);
      return PaletteItem.createPaletteGroup("uml.classifier", "Relation", relations, "symbol-property");
   }

   private PaletteItem featuresClass() {
      PaletteItem createProperty = node(ClassTypes.PROPERTY, "Property", "umlproperty");

      List<PaletteItem> features = Lists.newArrayList(createProperty);
      return PaletteItem.createPaletteGroup("uml.classifier", "Feature", features, "symbol-property");
   }

   private PaletteItem node(final String elementTypeId, final String label, final String icon) {
      return new PaletteItem(elementTypeId, label, new TriggerNodeCreationAction(elementTypeId), icon);
   }

   private PaletteItem edge(final String elementTypeId, final String label, final String icon) {
      return new PaletteItem(elementTypeId, label, new TriggerEdgeCreationAction(elementTypeId), icon);
   }

}
