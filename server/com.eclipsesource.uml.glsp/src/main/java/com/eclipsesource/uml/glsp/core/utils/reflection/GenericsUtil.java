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

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Objects;
import java.util.Optional;

import org.eclipse.glsp.server.types.GLSPServerException;

/*
 * Taken from GLSP-Server repo and modified
 */
public final class GenericsUtil {
   private GenericsUtil() {}

   public static ParameterizedType getClassParameterType(final Class<?> clazz, final Class<?> genericBaseclass) {
      if (clazz.equals(genericBaseclass) || clazz.getSuperclass().equals(genericBaseclass)) {
         return (ParameterizedType) clazz.getGenericSuperclass();
      }

      return getClassParameterType(clazz.getSuperclass(), genericBaseclass);
   }

   @SuppressWarnings({ "unchecked" })
   public static <T> Class<T> deriveClassActualType(final Class<?> current, final Class<?> target, final int position) {
      return (Class<T>) (GenericsUtil.getClassParameterType(current, target))
         .getActualTypeArguments()[position];
   }

   public static ParameterizedType getInterfaceParameterType(final Class<?> clazz, final Class<?> interfaceClass) {
      var interfaces = clazz.getGenericInterfaces();

      for (var type : interfaces) {
         if (type instanceof ParameterizedType) {
            var pType = (ParameterizedType) type;
            if (pType.getRawType().equals(interfaceClass)) {
               return pType;
            }
         }
      }

      return getInterfaceParameterType(clazz.getSuperclass(), interfaceClass);
   }

   @SuppressWarnings({ "unchecked" })
   public static <T> Class<T> deriveActualTypeArgument(final Class<?> clazz, final Class<?> baseType) {
      return (Class<T>) getActualTypeArgument(clazz, baseType);
   }

   /**
    * This method will search for an actual type argument that matches the expected base type, starting from the given
    * clazz up the complete class hierarchy.
    *
    * @param <T>      expected base type
    * @param clazz    search start
    * @param baseType base type that matches the actual type argument
    * @return the type argument that is closest to the given <code>clazz</code> and matches the given base base
    */
   public static <T> Class<? extends T> getActualTypeArgument(final Class<?> clazz, final Class<T> baseType) {
      return findActualTypeArgument(clazz, baseType)
         .orElseThrow(() -> new GLSPServerException("No matching type argument for " + baseType + " in " + clazz));
   }

   /**
    * This method will search for an actual type argument that matches the expected base type, starting from the given
    * clazz up the complete class hierarchy.
    *
    * @param <T>      expected base type
    * @param clazz    search start
    * @param baseType base type that matches the actual type argument
    * @return the type argument that is closest to the given <code>clazz</code> and matches the given base base
    */
   public static <T> Optional<Class<? extends T>> findActualTypeArgument(final Class<?> clazz,
      final Class<T> baseType) {
      return findActualTypeArgument(clazz, baseType, null);
   }

   /**
    * This method will search for an actual type argument that matches the expected base type, starting from the given
    * clazz until the search stop.
    *
    * @param <T>        expected base type
    * @param clazz      search start
    * @param baseType   base type that matches the actual type argument
    * @param searchStop search stop or <code>null</code> if we should search up to Object
    * @return the type argument that is closest to the given <code>clazz</code> and matches the given base base
    */
   @SuppressWarnings({ "unchecked", "checkstyle:CyclomaticComplexity" })
   public static <T> Optional<Class<? extends T>> findActualTypeArgument(final Class<?> clazz,
      final Class<T> baseType, final Class<?> searchStop) {
      if (clazz == null || baseType == null) {
         return Optional.empty();
      }
      if (clazz.getGenericSuperclass() instanceof ParameterizedType) {
         ParameterizedType parameterizedType = (ParameterizedType) clazz.getGenericSuperclass();
         for (Type typeArgument : parameterizedType.getActualTypeArguments()) {
            if (typeArgument instanceof Class<?> && baseType.isAssignableFrom((Class<?>) typeArgument)) {
               return Optional.of((Class<? extends T>) typeArgument);
            }
         }
      }
      return clazz.getSuperclass() == null || Objects.equals(clazz, searchStop)
         ? Optional.empty()
         : findActualTypeArgument(clazz.getSuperclass(), baseType, searchStop);
   }
}
