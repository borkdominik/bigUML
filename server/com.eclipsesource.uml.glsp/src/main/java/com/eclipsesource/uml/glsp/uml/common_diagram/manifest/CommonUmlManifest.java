/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.common_diagram.manifest;

import org.eclipse.glsp.server.operations.OperationHandler;

import com.eclipsesource.uml.glsp.diagram.DiagramConfiguration;
import com.eclipsesource.uml.glsp.manifest.contributions.DeleteOperationHandlerContribution;
import com.eclipsesource.uml.glsp.manifest.contributions.DiagramConfigurationContribution;
import com.eclipsesource.uml.glsp.manifest.contributions.DiagramPaletteContribution;
import com.eclipsesource.uml.glsp.manifest.contributions.EditLabelOperationHandlerContribution;
import com.eclipsesource.uml.glsp.manifest.contributions.OperationHandlerContribution;
import com.eclipsesource.uml.glsp.operations.DiagramDeleteOperationHandler;
import com.eclipsesource.uml.glsp.operations.DiagramEditLabelOperationHandler;
import com.eclipsesource.uml.glsp.palette.DiagramPalette;
import com.eclipsesource.uml.glsp.uml.common_diagram.configuration.CommonDiagramConfiguration;
import com.eclipsesource.uml.glsp.uml.common_diagram.diagram.CommonConfiguration;
import com.eclipsesource.uml.glsp.uml.common_diagram.operations.CommonDeleteOperationHandler;
import com.eclipsesource.uml.glsp.uml.common_diagram.operations.CommonLabelEditOperationHandler;
import com.eclipsesource.uml.glsp.uml.common_diagram.operations.CreateCommentEdgeOperationHandler;
import com.eclipsesource.uml.glsp.uml.common_diagram.operations.CreateCommentNodeOperationHandler;
import com.eclipsesource.uml.glsp.uml.common_diagram.palette.CommonPalette;
import com.google.inject.AbstractModule;
import com.google.inject.multibindings.Multibinder;

public class CommonUmlManifest extends AbstractModule
   implements DiagramConfigurationContribution, DiagramPaletteContribution, OperationHandlerContribution,
   DeleteOperationHandlerContribution, EditLabelOperationHandlerContribution {

   @Override
   protected void configure() {
      contributeConfiguration(binder());
      contributePalette(binder());
      contributeOperationHandler(binder());
      contributeDeleteOperationHandler(binder());
      contributeEditLabelOperationHandler(binder());

      // Default
      Multibinder.newSetBinder(binder(), CommonDiagramConfiguration.class);
   }

   @Override
   public void contributePalette(final Multibinder<DiagramPalette> multibinder) {
      multibinder.addBinding().to(CommonPalette.class);
   }

   @Override
   public void contributeConfiguration(final Multibinder<DiagramConfiguration> multibinder) {
      multibinder.addBinding().to(CommonConfiguration.class);
   }

   @Override
   public void contributeOperationHandler(final Multibinder<OperationHandler> multibinder) {
      multibinder.addBinding().to(CreateCommentEdgeOperationHandler.class);
      multibinder.addBinding().to(CreateCommentNodeOperationHandler.class);
   }

   @Override
   public void contributeEditLabelOperationHandler(final Multibinder<DiagramEditLabelOperationHandler> multibinder) {
      multibinder.addBinding().to(CommonLabelEditOperationHandler.class);
   }

   @Override
   public void contributeDeleteOperationHandler(final Multibinder<DiagramDeleteOperationHandler> multibinder) {
      multibinder.addBinding().to(CommonDeleteOperationHandler.class);
   }
}
