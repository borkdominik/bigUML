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

import com.eclipsesource.uml.glsp.core.manifest.DiagramManifest;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramConfigurationContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramCreateHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramDeleteHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramLabelEditMapperContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramUpdateHandlerContribution;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.diagram.CommunicationConfiguration;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.features.label_edit.InteractionLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.features.label_edit.LifelineLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.features.label_edit.MessageLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.features.tool_palette.CommunicationToolPaletteConfiguration;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.gmodel.InteractionNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.gmodel.LifelineNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.gmodel.MessageEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.interaction.CreateInteractionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.interaction.DeleteInteractionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.interaction.UpdateInteractionNameHandler;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.lifeline.CreateLifelineHandler;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.lifeline.DeleteLifelineHandler;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.lifeline.UpdateLifelineNameHandler;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.message.CreateMessageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.message.DeleteMessageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.message.UpdateMessageNameHandler;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class CommunicationUmlManifest extends DiagramManifest
   implements DiagramCreateHandlerContribution,
   DiagramConfigurationContribution, DiagramDeleteHandlerContribution, DiagramLabelEditMapperContribution,
   DiagramUpdateHandlerContribution {

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

      contributeDiagramConfiguration(() -> CommunicationConfiguration.class);
      contributeToolPaletteConfiguration((contribution) -> {
         contribution.addBinding().to(CommunicationToolPaletteConfiguration.class);
      });

      contributeDiagramCreateNodeHandlers((contribution) -> {
         contribution.addBinding().to(CreateInteractionHandler.class);
         contribution.addBinding().to(CreateLifelineHandler.class);
      });
      contributeDiagramCreateEdgeHandlers((contribution) -> {
         contribution.addBinding().to(CreateMessageHandler.class);
      });
      contributeDiagramDeleteHandlers((contribution) -> {
         contribution.addBinding().to(DeleteInteractionHandler.class);
         contribution.addBinding().to(DeleteLifelineHandler.class);
         contribution.addBinding().to(DeleteMessageHandler.class);

      });
      contributeDiagramUpdateHandlers((contribution) -> {
         contribution.addBinding().to(UpdateInteractionNameHandler.class);
         contribution.addBinding().to(UpdateLifelineNameHandler.class);
         contribution.addBinding().to(UpdateMessageNameHandler.class);
      });
      contributeDiagramLabelEditMappers((contribution) -> {
         contribution.addBinding().to(InteractionLabelEditMapper.class);
         contribution.addBinding().to(LifelineLabelEditMapper.class);
         contribution.addBinding().to(MessageLabelEditMapper.class);
      });
      contributeGModelMappers((contribution) -> {
         contribution.addBinding().to(InteractionNodeMapper.class);
         contribution.addBinding().to(LifelineNodeMapper.class);
         contribution.addBinding().to(MessageEdgeMapper.class);
      });
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
}
