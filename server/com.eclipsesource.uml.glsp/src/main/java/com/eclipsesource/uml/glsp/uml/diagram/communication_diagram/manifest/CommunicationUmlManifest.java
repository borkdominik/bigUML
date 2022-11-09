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
package com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.manifest;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.core.diagram.DiagramConfiguration;
import com.eclipsesource.uml.glsp.core.features.toolpalette.DiagramPalette;
import com.eclipsesource.uml.glsp.core.gmodel.GModelMapper;
import com.eclipsesource.uml.glsp.core.handler.operation.create.DiagramCreateHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.delete.DiagramDeleteHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.directediting.DiagramLabelEditHandler;
import com.eclipsesource.uml.glsp.core.manifest.DiagramManifest;
import com.eclipsesource.uml.glsp.core.manifest.contributions.CreateHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.DeleteHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.LabelEditHandlerContribution;
import com.eclipsesource.uml.glsp.features.outline.generator.DiagramOutlineGenerator;
import com.eclipsesource.uml.glsp.features.outline.manifest.contributions.OutlineGeneratorContribution;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.diagram.CommunicationConfiguration;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.features.outline.CommunicationOutlineGenerator;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.gmodel.InteractionNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.gmodel.LifelineNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.gmodel.MessageEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.interaction.CreateInteractionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.interaction.DeleteInteractionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.interaction.RenameInteractionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.lifeline.CreateLifelineHandler;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.lifeline.DeleteLifelineHandler;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.lifeline.RenameLifelineHandler;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.message.CreateMessageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.message.DeleteMessageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.message.RenameMessageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.palette.CommunicationPalette;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.multibindings.Multibinder;

public class CommunicationUmlManifest extends DiagramManifest
   implements CreateHandlerContribution.Contributor,
   DeleteHandlerContribution.Contributor, LabelEditHandlerContribution.Contributor,
   OutlineGeneratorContribution.Contributor {

   @Override
   public String id() {
      return representation().getName();
   }

   @Override
   public Representation representation() {
      return Representation.COMMUNICATION;
   }

   @Override
   protected void configure() {
      super.configure();

      contributeCreateHandler(binder());
      contributeDeleteHandler(binder());
      contributeLabelEditHandler(binder());
      // contributeOutlineGenerator(binder());
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
   public Class<? extends DiagramConfiguration> contributeDiagramConfiguration() {
      return CommunicationConfiguration.class;
   }

   @Override
   public void contributeCreateHandler(final Multibinder<DiagramCreateHandler> multibinder) {
      multibinder.addBinding().to(CreateInteractionHandler.class);
      multibinder.addBinding().to(CreateLifelineHandler.class);
      multibinder.addBinding().to(CreateMessageHandler.class);
   }

   @Override
   public void contributeLabelEditHandler(
      final Multibinder<DiagramLabelEditHandler<? extends EObject>> multibinder) {
      multibinder.addBinding().to(RenameInteractionHandler.class);
      multibinder.addBinding().to(RenameLifelineHandler.class);
      multibinder.addBinding().to(RenameMessageHandler.class);
   }

   @Override
   public void contributeDeleteHandler(final Multibinder<DiagramDeleteHandler<? extends EObject>> multibinder) {
      multibinder.addBinding().to(DeleteInteractionHandler.class);
      multibinder.addBinding().to(DeleteLifelineHandler.class);
      multibinder.addBinding().to(DeleteMessageHandler.class);
   }

   @Override
   public void contributeGModelMapper(
      final Multibinder<GModelMapper<? extends EObject, ? extends GModelElement>> multibinder) {
      multibinder.addBinding().to(InteractionNodeMapper.class);
      multibinder.addBinding().to(LifelineNodeMapper.class);
      multibinder.addBinding().to(MessageEdgeMapper.class);
   }

   @Override
   public Class<? extends DiagramOutlineGenerator> contributeOutlineGenerator() {
      return CommunicationOutlineGenerator.class;
   }
}
