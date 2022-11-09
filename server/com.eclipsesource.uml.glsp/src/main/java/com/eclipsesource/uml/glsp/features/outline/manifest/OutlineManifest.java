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

import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.actions.ActionHandler;

import com.eclipsesource.uml.glsp.core.manifest.contributions.ActionHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.ClientActionContribution;
import com.eclipsesource.uml.glsp.features.outline.generator.DefaultDiagramOutlineGenerator;
import com.eclipsesource.uml.glsp.features.outline.generator.DefaultOutlineGenerator;
import com.eclipsesource.uml.glsp.features.outline.handler.action.RequestOutlineHandler;
import com.eclipsesource.uml.glsp.features.outline.handler.action.SetOutlineAction;
import com.eclipsesource.uml.glsp.features.outline.manifest.contributions.OutlineGeneratorContribution;
import com.google.inject.AbstractModule;
import com.google.inject.Singleton;
import com.google.inject.multibindings.Multibinder;
import com.google.inject.multibindings.OptionalBinder;

public class OutlineManifest extends AbstractModule
   implements ClientActionContribution.Contributor, ActionHandlerContribution.Contributor,
   OutlineGeneratorContribution.Creator {

   public static final String Id = "OUTLINE_MANIFEST";

   @Override
   protected void configure() {
      super.configure();
      contributeClientAction(binder());
      contributeActionHandler(binder());
      createDiagramOutlineGeneratorBinding(binder());

      OptionalBinder.newOptionalBinder(binder(), DefaultDiagramOutlineGenerator.class)
         .setDefault()
         .to(DefaultOutlineGenerator.class)
         .in(Singleton.class);
   }

   @Override
   public String id() {
      return getClass().getSimpleName();
   }

   @Override
   public void contributeClientAction(final Multibinder<Action> multibinder) {
      multibinder.addBinding().to(SetOutlineAction.class);
   }

   @Override
   public void contributeActionHandler(final Multibinder<ActionHandler> multibinder) {
      multibinder.addBinding().to(RequestOutlineHandler.class);
   }
}
