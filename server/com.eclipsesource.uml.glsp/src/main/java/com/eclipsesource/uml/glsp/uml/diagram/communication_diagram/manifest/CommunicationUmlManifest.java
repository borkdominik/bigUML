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
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramCreateHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramDeleteHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramLabelEditHandlerContribution;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.ClassDiagramConfiguration;
import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.features.toolpalette.CommunicationToolPaletteConfiguration;
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
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class CommunicationUmlManifest extends DiagramManifest
   implements DiagramCreateHandlerContribution,
   DiagramDeleteHandlerContribution, DiagramLabelEditHandlerContribution {

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

      contributeDiagramConfiguration(() -> ClassDiagramConfiguration.class);
      contributeToolPaletteConfiguration((contribution) -> {
         contribution.addBinding().to(CommunicationToolPaletteConfiguration.class);
      });

      contributeDiagramCreateHandlers((contribution) -> {
         contribution.addBinding().to(CreateInteractionHandler.class);
         contribution.addBinding().to(CreateLifelineHandler.class);
         contribution.addBinding().to(CreateMessageHandler.class);
      });
      contributeDiagramDeleteHandlers((contribution) -> {
         contribution.addBinding().to(DeleteInteractionHandler.class);
         contribution.addBinding().to(DeleteLifelineHandler.class);
         contribution.addBinding().to(DeleteMessageHandler.class);

      });
      contributeDiagramLabelEditHandlers((contribution) -> {
         contribution.addBinding().to(RenameInteractionHandler.class);
         contribution.addBinding().to(RenameLifelineHandler.class);
         contribution.addBinding().to(RenameMessageHandler.class);
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
