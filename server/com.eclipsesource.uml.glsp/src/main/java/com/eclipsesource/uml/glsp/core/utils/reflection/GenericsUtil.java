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
package com.eclipsesource.uml.glsp.core.utils.reflection;

import java.lang.reflect.GenericDeclaration;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.lang.reflect.TypeVariable;
import java.util.HashMap;
import java.util.Map;

public final class GenericsUtil {
   private GenericsUtil() {}

   // https://stackoverflow.com/questions/18707582/get-actual-type-of-generic-type-argument-on-abstract-superclass
   @SuppressWarnings("unchecked")
   public static <T> Class<T> getClassParameter(final Class<?> subClass,
      final Class<?> superClass, final int pos) {
      Map<TypeVariable<?>, Class<?>> mapping = new HashMap<>();

      Class<?> klass = subClass;
      while (klass != null) {
         Type type = klass.getGenericSuperclass();
         if (type instanceof ParameterizedType) {
            ParameterizedType parType = (ParameterizedType) type;
            Type rawType = parType.getRawType();
            if (rawType == superClass) {
               // found
               Type t = parType.getActualTypeArguments()[pos];

               if (t instanceof Class<?>) {
                  return (Class<T>) t;
               }

               return (Class<T>) mapping.get(t);
            }

            // resolve
            Type[] vars = ((GenericDeclaration) (parType.getRawType())).getTypeParameters();
            Type[] args = parType.getActualTypeArguments();
            for (int i = 0; i < vars.length; i++) {
               if (args[i] instanceof Class<?>) {
                  mapping.put((TypeVariable) vars[i], (Class<?>) args[i]);
               } else {
                  mapping.put((TypeVariable) vars[i], mapping.get((args[i])));
               }
            }
            klass = (Class<?>) rawType;
         } else {
            klass = klass.getSuperclass();
         }
      }
      throw new IllegalArgumentException(
         "no generic supertype for " + subClass + " of type " + superClass);
   }
}
