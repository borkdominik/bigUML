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
package com.eclipsesource.uml.glsp.uml.communication_diagram.manifest;

import org.eclipse.glsp.server.operations.OperationHandler;

import com.eclipsesource.uml.glsp.diagram.DiagramConfiguration;
import com.eclipsesource.uml.glsp.features.outline.generator.DiagramOutlineGenerator;
import com.eclipsesource.uml.glsp.features.outline.manifest.contributions.OutlineGeneratorContribution;
import com.eclipsesource.uml.glsp.manifest.contributions.DeleteOperationHandlerContribution;
import com.eclipsesource.uml.glsp.manifest.contributions.DiagramConfigurationContribution;
import com.eclipsesource.uml.glsp.manifest.contributions.DiagramPaletteContribution;
import com.eclipsesource.uml.glsp.manifest.contributions.EditLabelOperationHandlerContribution;
import com.eclipsesource.uml.glsp.manifest.contributions.OperationHandlerContribution;
import com.eclipsesource.uml.glsp.operations.DiagramDeleteOperationHandler;
import com.eclipsesource.uml.glsp.operations.DiagramEditLabelOperationHandler;
import com.eclipsesource.uml.glsp.palette.DiagramPalette;
import com.eclipsesource.uml.glsp.uml.common_diagram.configuration.CommonDiagramConfiguration;
import com.eclipsesource.uml.glsp.uml.common_diagram.manifest.contributions.CommonDiagramConfigurationContribution;
import com.eclipsesource.uml.glsp.uml.communication_diagram.diagram.CommunicationConfiguration;
import com.eclipsesource.uml.glsp.uml.communication_diagram.features.outline.CommunicationOutlineGenerator;
import com.eclipsesource.uml.glsp.uml.communication_diagram.operations.CommunicationDeleteOperationHandler;
import com.eclipsesource.uml.glsp.uml.communication_diagram.operations.CommunicationLabelEditOperationHandler;
import com.eclipsesource.uml.glsp.uml.communication_diagram.operations.CreateInteractionNodeOperationHandler;
import com.eclipsesource.uml.glsp.uml.communication_diagram.operations.CreateLifelineNodeOperationHandler;
import com.eclipsesource.uml.glsp.uml.communication_diagram.operations.CreateMessageEdgeOperationHandler;
import com.eclipsesource.uml.glsp.uml.communication_diagram.palette.CommunicationPalette;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.AbstractModule;
import com.google.inject.multibindings.Multibinder;

public class CommunicationUmlManifest extends AbstractModule
   implements DiagramConfigurationContribution, DiagramPaletteContribution, OperationHandlerContribution,
   DeleteOperationHandlerContribution, EditLabelOperationHandlerContribution, OutlineGeneratorContribution,
   CommonDiagramConfigurationContribution {

   @Override
   protected void configure() {
      contributeConfiguration(binder());
      contributePalette(binder());
      contributeOperationHandler(binder());
      contributeDeleteOperationHandler(binder());
      contributeEditLabelOperationHandler(binder());
      contributeOutlineGenerator(binder());
      contributeCommonDiagramConfiguration(binder());
   }

   public void configureAdditionals() {
      /*
       * TODO: Enable for validation
       * bind(ModelValidator.class).annotatedWith(CommunicationValidator.class)
       * .to(CommunicationModelValidator.class);
       * bind(LabelEditValidator.class).annotatedWith(CommunicationValidator.class)
       * .to(CommunicationLabelEditValidator.class);
       * bind(new TypeLiteral<Validator<Interaction>>() {}).annotatedWith(CommunicationValidator.class)
       * .to(InteractionValidator.class);
       * bind(new TypeLiteral<Validator<Lifeline>>() {}).annotatedWith(CommunicationValidator.class)
       * .to(LifelineValidator.class);
       * bind(new TypeLiteral<Validator<Message>>() {}).annotatedWith(CommunicationValidator.class)
       * .to(MessageValidator.class);
       */
   }

   @Override
   public void contributePalette(final Multibinder<DiagramPalette> multibinder) {
      multibinder.addBinding().to(CommunicationPalette.class);
   }

   @Override
   public void contributeConfiguration(final Multibinder<DiagramConfiguration> multibinder) {
      multibinder.addBinding().to(CommunicationConfiguration.class);
   }

   @Override
   public void contributeOperationHandler(final Multibinder<OperationHandler> multibinder) {
      multibinder.addBinding().to(CreateInteractionNodeOperationHandler.class);
      multibinder.addBinding().to(CreateLifelineNodeOperationHandler.class);
      multibinder.addBinding().to(CreateMessageEdgeOperationHandler.class);
   }

   @Override
   public void contributeEditLabelOperationHandler(final Multibinder<DiagramEditLabelOperationHandler> multibinder) {
      multibinder.addBinding().to(CommunicationLabelEditOperationHandler.class);
   }

   @Override
   public void contributeDeleteOperationHandler(final Multibinder<DiagramDeleteOperationHandler> multibinder) {
      multibinder.addBinding().to(CommunicationDeleteOperationHandler.class);
   }

   @Override
   public void contributeOutlineGenerator(final Multibinder<DiagramOutlineGenerator> multibinder) {
      multibinder.addBinding().to(CommunicationOutlineGenerator.class);
   }

   @Override
   public void contributeCommonDiagramConfiguration(final Multibinder<CommonDiagramConfiguration> multibinder) {
      multibinder.addBinding().toInstance(new CommonDiagramConfiguration(Representation.COMMUNICATION));
   }
}
