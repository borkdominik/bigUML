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
package com.eclipsesource.uml.modelserver.shared.utils;

import java.util.Objects;
import java.util.function.Function;

@FunctionalInterface
public interface TriFunction<T, U, V, R> {

   R apply(T t, U u, V v);

   default <K> TriFunction<T, U, V, K> andThen(final Function<? super R, ? extends K> after) {
      Objects.requireNonNull(after);
      return (final T t, final U u, final V v) -> after.apply(apply(t, u, v));
   }
}
