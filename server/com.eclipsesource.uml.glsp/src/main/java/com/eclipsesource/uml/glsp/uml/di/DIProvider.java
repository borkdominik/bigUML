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
package com.eclipsesource.uml.glsp.uml.di;

import java.util.function.Function;

import com.google.inject.Inject;
import com.google.inject.Injector;
import com.google.inject.Provider;

public class DIProvider<TFactory, TComponent> implements Provider<TComponent> {

   protected Class<TFactory> factoryType;
   protected Function<TFactory, TComponent> accessor;

   @Inject
   protected Injector injector;

   public DIProvider(
      final Class<TFactory> factoryType, final Function<TFactory, TComponent> accessor) {
      this.factoryType = factoryType;
      this.accessor = accessor;
   }

   @Override
   public TComponent get() {
      var factory = injector.getInstance(factoryType);

      return accessor.apply(factory);
   }

}
