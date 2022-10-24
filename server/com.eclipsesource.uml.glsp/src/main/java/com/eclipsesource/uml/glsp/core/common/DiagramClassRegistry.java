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
package com.eclipsesource.uml.glsp.core.common;

import java.util.List;
import java.util.stream.Collectors;

import com.eclipsesource.uml.modelserver.unotation.Representation;

public abstract class DiagramClassRegistry<K extends Class<?>, V> extends DiagramRegistry<K, V> {

   @Override
   protected String deriveKey(final DoubleKey<Representation, K> key) {
      var representation = key.key1;
      var clazz = key.key2;

      if (clazz.isInterface()) {
         return representation.getName() + ":" + clazz;
      }

      var interfaces = List.of(clazz.getInterfaces());
      var keys = keys().stream().filter(k -> k.key1.equals(representation)).map(k -> k.key2)
         .collect(Collectors.toSet());

      var found = keys.stream().filter(k -> interfaces.contains(k)).findFirst();
      if (found.isPresent()) {
         return representation.getName() + ":" + found.get();
      }

      return super.deriveKey(key);
   }
}
