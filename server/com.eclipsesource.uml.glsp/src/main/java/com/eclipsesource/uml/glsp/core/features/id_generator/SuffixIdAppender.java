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
package com.eclipsesource.uml.glsp.core.features.id_generator;

public interface SuffixIdAppender {
   String suffix();

   default String appendTo(final String id) {
      return id + suffix();
   }

   default boolean isSuffixOf(final String id) {
      return id.endsWith(suffix());
   }

   default String clear(final String id) {
      if (isSuffixOf(id)) {
         return id.substring(0, id.length() - suffix().length());
      }

      return id;
   }
}
