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

import com.google.inject.AbstractModule;

public class CommonUmlManifest extends AbstractModule {
   /*-
   @Override
   protected void configure() {
      contributeDiagramConfiguration((contribution) -> {});
      contributePalette((contribution) -> {});
      contributeOperationHandler((contribution) -> {});
      // contributeDeleteHandler((contribution) -> {});
      contributeEditLabelOperationHandler((contribution) -> {});
   
      // Default
      Multibinder.newSetBinder(CommonDiagramConfiguration.class);
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
   */
}
