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
package com.eclipsesource.uml.glsp.utils.gmodel;

import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.eclipse.glsp.graph.GModelElement;

public final class GModelFilterUtil {
   private GModelFilterUtil() {}

   public static <T> Stream<T> filterByType(final Collection<GModelElement> elements, final String type,
      final Class<T> clazz) {
      return elements.stream().filter(e -> e.getType().equals(type) && clazz.isInstance(e)).map(clazz::cast);
   }

   public static <T> Stream<T> flatFilterByType(final GModelElement element, final String type, final Class<T> clazz) {
      var elements = flat(element);

      return filterByType(elements, type, clazz);
   }

   public static <T> Stream<T> flatFilterById(final GModelElement element, final String id, final Class<T> clazz) {
      var elements = flat(element);

      return elements.stream().filter(e -> e.getId().equals(id) && clazz.isInstance(e)).map(clazz::cast);
   }

   private static List<GModelElement> flat(final GModelElement element) {
      var elements = new LinkedList<GModelElement>();
      elements.add(element);

      elements.addAll(
         element.getChildren().stream().map(e -> flat(e)).flatMap(Collection::stream).collect(Collectors.toList()));

      return elements;
   }
}
