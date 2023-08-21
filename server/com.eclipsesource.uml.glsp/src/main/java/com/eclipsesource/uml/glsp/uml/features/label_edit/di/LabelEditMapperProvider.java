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
package com.eclipsesource.uml.glsp.uml.features.label_edit.di;

import com.eclipsesource.uml.glsp.core.features.label_edit.DiagramLabelEditMapper;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.Injector;
import com.google.inject.Provider;

public class LabelEditMapperProvider
   implements Provider<DiagramLabelEditMapper<?>> {

   protected Representation representation;
   protected Class<? extends LabelEditMapperFactory> factoryType;

   @Inject
   protected Injector injector;

   public LabelEditMapperProvider(final Representation representation,
      final Class<? extends LabelEditMapperFactory> factoryType) {
      this.representation = representation;
      this.factoryType = factoryType;
   }

   @Override
   public DiagramLabelEditMapper<?> get() {
      var factory = injector.getInstance(factoryType);

      return factory.labelEditMapper(representation);
   }

}
