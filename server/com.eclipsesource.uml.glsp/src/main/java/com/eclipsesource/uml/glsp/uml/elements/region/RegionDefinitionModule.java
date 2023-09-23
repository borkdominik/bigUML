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
package com.eclipsesource.uml.glsp.uml.elements.region;

import com.eclipsesource.uml.glsp.core.handler.operation.create.DiagramCreateNodeHandler;
import com.eclipsesource.uml.glsp.core.manifest.DiagramManifest;
import com.eclipsesource.uml.glsp.uml.di.DIProvider;
import com.eclipsesource.uml.glsp.uml.manifest.node.NodeFactoryDefinition;
import com.google.inject.multibindings.Multibinder;

public class RegionDefinitionModule extends NodeFactoryDefinition {

   public RegionDefinitionModule(final DiagramManifest manifest) {
      super(manifest.id(), manifest.representation(), RegionFactory.class);
   }

   @Override
   protected void diagramCreateHandlers(final Multibinder<DiagramCreateNodeHandler<?>> contribution) {
      super.diagramCreateHandlers(contribution);
      contribution.addBinding()
         .toProvider(new DIProvider<RegionFactory, DiagramCreateNodeHandler<?>>(RegionFactory.class,
            (factory) -> factory.regionInStateCreateHandler(representation())));
   }
}
