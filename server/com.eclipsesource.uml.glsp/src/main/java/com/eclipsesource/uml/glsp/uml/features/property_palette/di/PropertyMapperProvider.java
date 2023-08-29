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
package com.eclipsesource.uml.glsp.uml.features.property_palette.di;

import com.eclipsesource.uml.glsp.features.property_palette.mapper.DiagramElementPropertyMapper;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.Injector;
import com.google.inject.Provider;

public class PropertyMapperProvider
   implements Provider<DiagramElementPropertyMapper<?>> {

   protected Representation representation;
   protected Class<? extends PropertyMapperFactory> factoryType;

   @Inject
   protected Injector injector;

   public PropertyMapperProvider(final Representation representation,
      final Class<? extends PropertyMapperFactory> factoryType) {
      this.representation = representation;
      this.factoryType = factoryType;
   }

   @Override
   public DiagramElementPropertyMapper<?> get() {
      var factory = injector.getInstance(factoryType);

      return factory.elementPropertyMapper(representation);
   }

}
