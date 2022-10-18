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
package com.eclipsesource.uml.glsp.uml.diagram.common_diagram.manifest;

import org.eclipse.glsp.server.operations.OperationHandler;

import com.eclipsesource.uml.glsp.core.diagram.DiagramConfiguration;
import com.eclipsesource.uml.glsp.core.handler.operation.DiagramDeleteHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.DiagramEditLabelOperationHandler;
import com.eclipsesource.uml.glsp.core.manifest.contributions.DeleteHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.DiagramConfigurationContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.PaletteContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.EditLabelOperationHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.OperationHandlerContribution;
import com.eclipsesource.uml.glsp.core.palette.DiagramPalette;
import com.eclipsesource.uml.glsp.uml.diagram.common_diagram.configuration.CommonDiagramConfiguration;
import com.eclipsesource.uml.glsp.uml.diagram.common_diagram.diagram.CommonConfiguration;
import com.eclipsesource.uml.glsp.uml.diagram.common_diagram.operations.CommonLabelEditOperationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.common_diagram.operations.CreateCommentEdgeOperationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.common_diagram.operations.CreateCommentNodeOperationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.common_diagram.palette.CommonPalette;
import com.google.inject.AbstractModule;
import com.google.inject.multibindings.Multibinder;

public class CommonUmlManifest extends AbstractModule
   implements DiagramConfigurationContribution, PaletteContribution, OperationHandlerContribution,
   DeleteHandlerContribution, EditLabelOperationHandlerContribution {

   @Override
   protected void configure() {
      contributeDiagramConfiguration(binder());
      contributePalette(binder());
      contributeOperationHandler(binder());
      contributeDeleteHandler(binder());
      contributeEditLabelOperationHandler(binder());

      // Default
      Multibinder.newSetBinder(binder(), CommonDiagramConfiguration.class);
   }

   @Override
   public void contributePalette(final Multibinder<DiagramPalette> multibinder) {
      multibinder.addBinding().to(CommonPalette.class);
   }

   @Override
   public void contributeDiagramConfiguration(final Multibinder<DiagramConfiguration> multibinder) {
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
   public void contributeDeleteHandler(final Multibinder<DiagramDeleteHandler> multibinder) {
      // multibinder.addBinding().to(CommonDeleteOperationHandler.class);
   }
}
