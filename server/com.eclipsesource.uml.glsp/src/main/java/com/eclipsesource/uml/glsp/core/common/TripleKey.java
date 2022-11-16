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

public class TripleKey<K1, K2, K3> {
   public final K1 key1;
   public final K2 key2;
   public final K3 key3;

   public TripleKey(final K1 key1, final K2 key2, final K3 key3) {
      this.key1 = key1;
      this.key2 = key2;
      this.key3 = key3;
   }

   public static <K1, K2, K3> TripleKey<K1, K2, K3> of(final K1 key1, final K2 key2, final K3 key3) {
      return new TripleKey<>(key1, key2, key3);
   }

   @Override
   public int hashCode() {
      return Objects.hash(key1, key2, key3);
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
      TripleKey other = (TripleKey) obj;
      return Objects.equals(key1, other.key1) && Objects.equals(key2, other.key2) && Objects.equals(key3, other.key3);
   }

}
