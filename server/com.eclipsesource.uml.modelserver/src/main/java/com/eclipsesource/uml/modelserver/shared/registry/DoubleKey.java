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
package com.eclipsesource.uml.modelserver.shared.registry;

import java.util.Objects;

public class DoubleKey<K1, K2> {
   public final K1 key1;
   public final K2 key2;

   public DoubleKey(final K1 key1, final K2 key2) {
      this.key1 = key1;
      this.key2 = key2;
   }

   public static <K1, K2> DoubleKey<K1, K2> of(final K1 key1, final K2 key2) {
      return new DoubleKey<>(key1, key2);
   }

   @Override
   public int hashCode() {
      return Objects.hash(key1, key2);
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
      DoubleKey other = (DoubleKey) obj;
      return Objects.equals(key1, other.key1) && Objects.equals(key2, other.key2);
   }

}
