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

import com.eclipsesource.uml.glsp.features.outline.actions.RequestOutlineHandler;
import com.eclipsesource.uml.glsp.features.outline.actions.SetOutlineAction;
import com.eclipsesource.uml.glsp.features.outline.generator.DefaultOutlineGeneratorImpl;
import com.eclipsesource.uml.glsp.features.outline.generator.DefaultOutlineGenerator;
import com.eclipsesource.uml.glsp.manifest.contributions.ActionHandlerContribution;
import com.eclipsesource.uml.glsp.manifest.contributions.ClientActionContribution;
import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.Singleton;
import com.google.inject.multibindings.Multibinder;

public class OutlineManifest extends AbstractModule
   implements ClientActionContribution, ActionHandlerContribution {
   @Override
   protected void configure() {
      super.configure();
      contributeClientAction(binder());
      contributeActionHandler(binder());
   }

   @Override
   public void contributeClientAction(final Multibinder<Action> multibinder) {
      multibinder.addBinding().to(SetOutlineAction.class);
   }

   @Override
   public void contributeActionHandler(final Multibinder<ActionHandler> multibinder) {
      multibinder.addBinding().to(RequestOutlineHandler.class);
   }

   @Provides
   @Singleton
   DefaultOutlineGenerator provideDefaultOutlineGenerator() {
      return new DefaultOutlineGeneratorImpl();
   }
}
