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
package com.eclipsesource.uml.glsp.features.outline.manifest;

import com.eclipsesource.uml.glsp.core.manifest.FeatureManifest;
import com.eclipsesource.uml.glsp.core.manifest.contributions.glsp.ActionHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.glsp.ClientActionContribution;
import com.eclipsesource.uml.glsp.features.outline.generator.DefaultDiagramOutlineGenerator;
import com.eclipsesource.uml.glsp.features.outline.generator.NotationBasedOutlineGenerator;
import com.eclipsesource.uml.glsp.features.outline.handler.action.DiagramOutlineGeneratorRegistry;
import com.eclipsesource.uml.glsp.features.outline.handler.action.RequestOutlineHandler;
import com.eclipsesource.uml.glsp.features.outline.handler.action.SetOutlineAction;
import com.eclipsesource.uml.glsp.features.outline.manifest.contributions.OutlineGeneratorContribution;
import com.google.inject.Singleton;
import com.google.inject.multibindings.OptionalBinder;

public class OutlineFeatureManifest extends FeatureManifest
   implements ClientActionContribution, ActionHandlerContribution, OutlineGeneratorContribution.Definition {

   public static String ID = OutlineFeatureManifest.class.getSimpleName();

   @Override
   public String id() {
      return ID;
   }

   @Override
   protected void configure() {
      super.configure();
      contributeClientActions((contribution) -> {
         contribution.addBinding().to(SetOutlineAction.class);
      });
      contributeActionHandlers((contribution) -> {
         contribution.addBinding().to(RequestOutlineHandler.class);
      });

      defineOutlineGeneratorContribution();

      bind(DiagramOutlineGeneratorRegistry.class).in(Singleton.class);
      OptionalBinder.newOptionalBinder(binder(), DefaultDiagramOutlineGenerator.class)
         .setDefault()
         .to(NotationBasedOutlineGenerator.class)
         .in(Singleton.class);
   }
}
