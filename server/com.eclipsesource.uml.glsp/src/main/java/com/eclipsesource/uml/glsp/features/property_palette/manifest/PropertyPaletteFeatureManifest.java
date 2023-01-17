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
package com.eclipsesource.uml.glsp.features.property_palette.manifest;

import com.eclipsesource.uml.glsp.core.manifest.FeatureManifest;
import com.eclipsesource.uml.glsp.core.manifest.contributions.glsp.ActionHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.glsp.ClientActionContribution;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.DiagramElementPropertyMapperRegistry;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.RequestPropertyPaletteHandler;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.SetPropertyPaletteAction;
import com.eclipsesource.uml.glsp.features.property_palette.manifest.contributions.DiagramElementPropertyMapperContribution;
import com.google.inject.Singleton;

public class PropertyPaletteFeatureManifest extends FeatureManifest
   implements ClientActionContribution, ActionHandlerContribution, DiagramElementPropertyMapperContribution.Definition {

   @Override
   protected void configure() {
      super.configure();

      contributeClientActions((contribution) -> {
         contribution.addBinding().to(SetPropertyPaletteAction.class);
      });
      contributeActionHandlers((contribution) -> {
         contribution.addBinding().to(RequestPropertyPaletteHandler.class);
      });

      defineDiagramElementPropertyMapperContribution();

      bind(DiagramElementPropertyMapperRegistry.class).in(Singleton.class);

   }
}
