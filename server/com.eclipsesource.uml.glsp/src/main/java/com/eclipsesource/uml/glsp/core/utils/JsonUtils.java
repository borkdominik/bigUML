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
package com.eclipsesource.uml.glsp.core.utils;

import java.util.Optional;

import com.google.gson.Gson;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;

public class JsonUtils {

   public static boolean isValid(final String json) {
      try {
         JsonParser.parseString(json);
      } catch (JsonSyntaxException e) {
         return false;
      }
      return true;
   }

   public static <T> Optional<T> parse(final String json, final Class<T> clazz) {
      try {
         return Optional.of(new Gson().fromJson(json, clazz));
      } catch (JsonSyntaxException e) {}

      return Optional.empty();
   }
}
