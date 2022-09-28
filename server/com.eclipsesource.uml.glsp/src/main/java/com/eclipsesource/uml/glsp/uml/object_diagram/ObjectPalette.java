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
package com.eclipsesource.uml.glsp.uml.object_diagram;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.actions.TriggerEdgeCreationAction;
import org.eclipse.glsp.server.actions.TriggerNodeCreationAction;
import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.eclipsesource.uml.glsp.uml.object_diagram.constants.ObjectTypes;
import com.google.common.collect.Lists;

public class ObjectPalette {
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return Lists.newArrayList(classifiersObject(), relationsObject(), featuresObject());
   }

   private PaletteItem classifiersObject() {
      PaletteItem createObject = node(ObjectTypes.OBJECT, "Object", "umlobject");

      List<PaletteItem> classifiers = Lists.newArrayList(createObject);
      return PaletteItem.createPaletteGroup("uml.classifier", "Container", classifiers, "symbol-property");
   }

   private PaletteItem relationsObject() {
      PaletteItem createLink = edge(ObjectTypes.LINK, "Link", "umlassociation");

      List<PaletteItem> relations = Lists.newArrayList(createLink);
      return PaletteItem.createPaletteGroup("uml.classifier", "Relation", relations, "symbol-property");
   }

   private PaletteItem featuresObject() {
      PaletteItem createAttribute = node(ObjectTypes.ATTRIBUTE, "Attribute", "umlproperty");

      List<PaletteItem> features = Lists.newArrayList(createAttribute);
      return PaletteItem.createPaletteGroup("uml.classifier", "Feature", features, "symbol-property");
   }

   private PaletteItem node(final String elementTypeId, final String label, final String icon) {
      return new PaletteItem(elementTypeId, label, new TriggerNodeCreationAction(elementTypeId), icon);
   }

   private PaletteItem edge(final String elementTypeId, final String label, final String icon) {
      return new PaletteItem(elementTypeId, label, new TriggerEdgeCreationAction(elementTypeId), icon);
   }

}
