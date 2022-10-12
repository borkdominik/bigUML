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

import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.uml2.uml.UMLFactory;

public final class ReflectionUtil {
   private static Logger LOG = LogManager.getLogger(ReflectionUtil.class);

   private ReflectionUtil() {}

   public static <T> Optional<T> construct(final Class<? extends T> clazz) {
      try {
         return Optional.of(clazz.getConstructor().newInstance());
      } catch (ReflectiveOperationException | SecurityException e) {
         LOG.error("Could not construct instance of class: " + clazz, e);
         return Optional.empty();
      }
   }

   public static <T> Optional<T> constructUml(final Class<? extends T> clazz) {
      try {
         var factoryClass = UMLFactory.eINSTANCE.getClass();

         var methods = getStaticMethods(factoryClass);
         var method = factoryClass.getMethod("create" + clazz.getSimpleName());
         var result = (T) method.invoke(UMLFactory.eINSTANCE);

         return Optional.of(result);
      } catch (ReflectiveOperationException | SecurityException e) {
         LOG.error("Could not construct instance of class: " + clazz, e);
         return Optional.empty();
      }
   }

   public static List<Method> getStaticMethods(final Class<?> clazz) {
      List<Method> methods = new ArrayList<>();
      for (Method method : clazz.getMethods()) {
         if (!Modifier.isStatic(method.getModifiers())) {
            methods.add(method);
         }
      }
      return Collections.unmodifiableList(methods);
   }

   public static <T> Stream<? extends T> construct(final Stream<Class<? extends T>> classes) {
      return classes
         .filter(clazz -> !Modifier.isAbstract(clazz.getModifiers()))
         .flatMap(clazz -> construct(clazz).stream());
   }

   public static <T> Stream<? extends T> construct(final Collection<Class<? extends T>> classes) {
      return construct(classes.stream());
   }

   public static <T> List<? extends T> constructToList(final Stream<Class<? extends T>> classes) {
      return construct(classes).collect(Collectors.toList());
   }

   public static <T> List<? extends T> constructToList(final Collection<Class<? extends T>> classes) {
      return constructToList(classes.stream());
   }
}
