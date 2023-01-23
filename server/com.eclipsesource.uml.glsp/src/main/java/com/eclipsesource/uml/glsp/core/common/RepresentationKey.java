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

import java.util.Objects;

import com.eclipsesource.uml.modelserver.unotation.Representation;

public class RepresentationKey<Key> {
   public final Representation representation;
   public final Key key;

   public RepresentationKey(final Representation representation, final Key key) {
      this.representation = representation;
      this.key = key;
   }

   public static <Key> RepresentationKey<Key> of(final Representation representation, final Key key) {
      return new RepresentationKey<>(representation, key);
   }

   @Override
   public int hashCode() {
      return Objects.hash(representation, key);
   }

   @Override
   public boolean equals(final Object obj) {
      if (this == obj) {
         return true;
      }
      if (obj == null) {
         return false;
      }
      if (getClass() != obj.getClass()) {
         return false;
      }
      RepresentationKey other = (RepresentationKey) obj;
      return Objects.equals(representation, other.representation) && Objects.equals(key, other.key);
   }

}
