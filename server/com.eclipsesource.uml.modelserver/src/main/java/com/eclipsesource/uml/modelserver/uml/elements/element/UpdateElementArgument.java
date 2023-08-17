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
package com.eclipsesource.uml.modelserver.uml.elements.element;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.TypeVariable;

public abstract class UpdateElementArgument {

   public static abstract class Builder<TArgument extends UpdateElementArgument> {
      protected TArgument argument;

      public Builder() {
         argument = createArgument();
         if (argument == null) {
            throw new IllegalStateException("Could not create update argument");
         }
      }

      protected TArgument createArgument() {
         var current = getClass();
         var generic = current.getGenericSuperclass();

         if (generic instanceof ParameterizedType) {
            var parType = (ParameterizedType) generic;
            var argumentType = parType.getActualTypeArguments()[0];
            if (argumentType instanceof TypeVariable) {
               var typeVar = (TypeVariable) argumentType;
               var bound = (Class<TArgument>) typeVar.getBounds()[0];
               try {
                  return bound.getDeclaredConstructor().newInstance();
               } catch (InstantiationException | IllegalAccessException | IllegalArgumentException
                  | InvocationTargetException | NoSuchMethodException | SecurityException e) {
                  e.printStackTrace();
                  return null;
               }
            }
         }

         return null;
      }

      public TArgument build() {
         return argument;
      }
   }
}
