/********************************************************************************
 * Copyright (c) 2024 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.sdk.utils;

import java.util.Collection;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class StreamUtils {
   public static <T extends Collection<?>> T concat(final T one, final T two) {
      return (T) Stream.concat(one.stream(), two.stream()).collect(Collectors.toList());
   }

   public static <T extends Collection<?>> T concat(final T one, final T two, final T three) {
      return (T) Stream.concat(
         Stream.concat(one.stream(), two.stream()),
         three.stream())
         .collect(Collectors.toList());
   }
}
