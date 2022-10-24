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
package com.eclipsesource.uml.glsp.core.features.idgenerator;

public interface SuffixIdAppender {

   String appendTo(String id);

   String clear(String id);

   String suffix();

   boolean isSuffixOf(String id);

   default String clear(final String id, final String suffix) {
      if (isSuffixOf(id)) {
         return id.substring(0, id.length() - suffix.length());
      }

      return id;
   }
}
