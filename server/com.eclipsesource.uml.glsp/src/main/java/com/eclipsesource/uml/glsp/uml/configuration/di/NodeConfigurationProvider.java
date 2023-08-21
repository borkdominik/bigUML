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
package com.eclipsesource.uml.glsp.uml.configuration.di;

import com.eclipsesource.uml.glsp.uml.configuration.NodeConfiguration;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.Injector;
import com.google.inject.Provider;

public class NodeConfigurationProvider
   implements Provider<NodeConfiguration<?>> {

   protected Representation representation;
   protected Class<? extends NodeConfigurationFactory> factoryType;

   @Inject
   protected Injector injector;

   public NodeConfigurationProvider(final Representation representation,
      final Class<? extends NodeConfigurationFactory> factoryType) {
      this.representation = representation;
      this.factoryType = factoryType;
   }

   @Override
   public NodeConfiguration<?> get() {
      var factory = injector.getInstance(factoryType);

      return factory.nodeConfiguration(representation);
   }

}
