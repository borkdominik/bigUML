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
package com.eclipsesource.uml.glsp.uml.gmodel.di;

import com.eclipsesource.uml.glsp.core.gmodel.GModelMapper;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.Injector;
import com.google.inject.Provider;

public class GModelMapperProvider
   implements Provider<GModelMapper<?, ?>> {

   protected Representation representation;
   protected Class<? extends GModelMapperFactory> factoryType;

   @Inject
   protected Injector injector;

   public GModelMapperProvider(final Representation representation,
      final Class<? extends GModelMapperFactory> factoryType) {
      this.representation = representation;
      this.factoryType = factoryType;
   }

   @Override
   public GModelMapper<?, ?> get() {
      var factory = injector.getInstance(factoryType);

      return factory.gmodel(representation);
   }

}
