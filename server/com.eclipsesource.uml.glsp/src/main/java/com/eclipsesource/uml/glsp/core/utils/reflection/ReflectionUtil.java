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

import java.util.NoSuchElementException;
import java.util.Optional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.UMLFactory;

public final class ReflectionUtil {
   private static Logger LOG = LogManager.getLogger(ReflectionUtil.class);

   private ReflectionUtil() {}

   @SuppressWarnings("unchecked")
   public static <T> Optional<T> constructUml(final Class<? extends T> clazz) {
      try {
         var factoryClass = UMLFactory.eINSTANCE.getClass();

         var method = factoryClass.getMethod("create" + clazz.getSimpleName());
         var result = (T) method.invoke(UMLFactory.eINSTANCE);

         return Optional.of(result);
      } catch (ReflectiveOperationException | SecurityException e) {
         LOG.error("Could not construct instance of class: " + clazz, e);
         return Optional.empty();
      }
   }

   public static <T> T castOrThrow(final Object toCast, final Class<T> clazz, final String exceptionMessage) {
      try {
         return clazz.cast(toCast);
      } catch (NoSuchElementException | ClassCastException ex) {
         throw new GLSPServerException(exceptionMessage, ex);
      }
   }

}
