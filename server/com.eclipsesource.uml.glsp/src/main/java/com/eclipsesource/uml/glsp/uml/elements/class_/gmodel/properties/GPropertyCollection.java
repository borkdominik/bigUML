/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.properties;

import java.util.Collection;
import java.util.LinkedList;
import java.util.List;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

public class GPropertyCollection {
   protected List<GProperty> properties = new LinkedList<>();

   public static GPropertyCollection of(final GProperty... elements) {
      var collection = new GPropertyCollection();
      collection.addProperties(List.of(elements));
      return collection;
   }

   public GPropertyCollection() {

   }

   public void addProperties(final Collection<GProperty> properties) {
      getProperties().addAll(properties);
   }

   public List<GProperty> getProperties() { return properties; }

   public void assign(final GModelElement element) {
      properties.stream().forEach(p -> {
         if (p instanceof GModelProperty) {
            var prop = (GModelProperty) p;
            prop.assign(element);
         }
      });
   }

   public void assign(final EObject source, final GModelElement element) {
      properties.stream().forEach(p -> {
         if (p instanceof GNotationProperty) {
            var prop = (GNotationProperty) p;
            prop.assign(source, element);
         }
      });
   }

   public static class Options {}
}
