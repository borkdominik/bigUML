/********************************************************************************
 * \ * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.manifest;

import com.eclipsesource.uml.glsp.core.manifest.DiagramManifest;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramCreateHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramDeleteHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramLabelEditMapperContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramUpdateHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.glsp.ActionHandlerContribution;
import com.eclipsesource.uml.glsp.features.property_palette.manifest.contributions.DiagramElementPropertyMapperContribution;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_BehaviorExecution;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_CombinedFragment;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_DestructionOccurrence;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_ExecutionOccurrence;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_Interaction;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_InteractionOperand;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_InteractionUse;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_Lifeline;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_Message;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_MessageAnchor;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_MessageOccurrence;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.features.label_edit.InteractionLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.features.label_edit.InteractionOperandLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.features.label_edit.LifelineLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.features.label_edit.MessageLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.features.property_palette.BehaviourExecutionPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.features.property_palette.CombinedFragmentPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.features.property_palette.InteractionOperandPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.features.property_palette.InteractionPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.features.property_palette.InteractionUsePropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.features.property_palette.LifelinePropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.features.property_palette.MessagePropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.features.tool_palette.SequenceToolPaletteConfiguration;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.gmodel.BehaviorExecutionNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.gmodel.CombinedFragmentNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.gmodel.DestructionOccurrenceNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.gmodel.ExecutionOccurrenceNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.gmodel.InteractionNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.gmodel.InteractionOperandNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.gmodel.InteractionUseNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.gmodel.LifelineNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.gmodel.MessageAnchorNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.gmodel.MessageEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.gmodel.MessageOccurrenceNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.behaviorExecution.CreateBehaviorExecutionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.behaviorExecution.DeleteBehaviorExecutionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.behaviorExecution.UpdateBehaviorExecutionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.combined_fragment.CreateCombinedFragmentHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.combined_fragment.DeleteCombinedFragmentHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.combined_fragment.UpdateCombinedFragmentHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.destructionOccurrence.CreateDestructionOccurrenceHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.executionOccurrence.CreateExecutionOccurrenceHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.executionOccurrence.DeleteExecutionOccurrenceHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.executionOccurrence.UpdateExecutionOccurrenceHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.interaction.CreateInteractionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.interaction.DeleteInteractionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.interaction.UpdateInteractionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.interaction_operand.CreateInteractionOperandHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.interaction_operand.DeleteInteractionOperandHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.interaction_operand.UpdateInteractionOperandHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.interaction_use.CreateInteractionUseHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.interaction_use.DeleteInteractionUseHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.interaction_use.UpdateInteractionUseHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.lifeline.CreateLifelineHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.lifeline.DeleteLifelineHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.lifeline.UpdateLifelineHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.message.CreateCreateMessageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.message.CreateDeleteMessageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.message.CreateFoundMessageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.message.CreateLostMessageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.message.CreateMessageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.message.CreateReplyMessageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.message.CreateSyncMessageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.message.DeleteMessageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.message.UpdateMessageHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.messageOccurrence.CreateMessageOccurrenceHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.messageOccurrence.DeleteMessageOccurrenceHandler;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.messageOccurrence.UpdateMessageOccurrenceHandler;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class SequenceUmlManifest extends DiagramManifest
   implements DiagramCreateHandlerContribution,
   DiagramDeleteHandlerContribution, DiagramLabelEditMapperContribution, DiagramUpdateHandlerContribution,
   DiagramElementPropertyMapperContribution, ActionHandlerContribution {

   @Override
   public String id() {
      return representation().getName();
   }

   @Override
   public Representation representation() {
      return Representation.SEQUENCE;
   }

   @Override
   protected void configure() {
      super.configure();

      contributeDiagramElementConfiguration((nodes) -> {
         nodes.addBinding().to(UmlSequence_Interaction.DiagramConfiguration.class);
         nodes.addBinding().to(UmlSequence_Lifeline.DiagramConfiguration.class);

         nodes.addBinding().to(UmlSequence_BehaviorExecution.DiagramConfiguration.class);

         nodes.addBinding().to(UmlSequence_MessageOccurrence.DiagramConfiguration.class);
         nodes.addBinding().to(UmlSequence_MessageAnchor.DiagramConfiguration.class);
         nodes.addBinding().to(UmlSequence_ExecutionOccurrence.DiagramConfiguration.class);
         nodes.addBinding().to(UmlSequence_DestructionOccurrence.DiagramConfiguration.class);

         nodes.addBinding().to(UmlSequence_CombinedFragment.DiagramConfiguration.class);
         nodes.addBinding().to(UmlSequence_InteractionOperand.DiagramConfiguration.class);
         nodes.addBinding().to(UmlSequence_InteractionUse.DiagramConfiguration.class);

      }, (edges) -> {
         edges.addBinding().to(UmlSequence_Message.DiagramConfiguration.class);
      }, (ports) -> {});

      contributeToolPaletteConfiguration((contribution) -> {
         contribution.addBinding().to(SequenceToolPaletteConfiguration.class);
      });

      contributeActionHandlers((contribution) -> {
         // contribution.addBinding().to(UmlSelectionActionHandler.class); // it breaks a bit the marquee tool...
      });

      contributeDiagramCreateNodeHandlers((contribution) -> {
         contribution.addBinding().to(CreateInteractionHandler.class);
         contribution.addBinding().to(CreateLifelineHandler.class);

         contribution.addBinding().to(CreateMessageOccurrenceHandler.class);
         contribution.addBinding().to(CreateDestructionOccurrenceHandler.class);
         contribution.addBinding().to(CreateExecutionOccurrenceHandler.class);

         contribution.addBinding().to(CreateBehaviorExecutionHandler.class);
         contribution.addBinding().to(CreateCombinedFragmentHandler.class);
         contribution.addBinding().to(CreateInteractionOperandHandler.class);
         contribution.addBinding().to(CreateInteractionUseHandler.class);
      });

      contributeDiagramCreateEdgeHandlers((contribution) -> {

         contribution.addBinding().to(CreateMessageHandler.class);
         contribution.addBinding().to(CreateReplyMessageHandler.class);
         contribution.addBinding().to(CreateSyncMessageHandler.class);
         contribution.addBinding().to(CreateCreateMessageHandler.class);
         contribution.addBinding().to(CreateDeleteMessageHandler.class);
         contribution.addBinding().to(CreateFoundMessageHandler.class);
         contribution.addBinding().to(CreateLostMessageHandler.class);

      });

      contributeDiagramDeleteHandlers((contribution) -> {
         contribution.addBinding().to(DeleteInteractionHandler.class);
         contribution.addBinding().to(DeleteLifelineHandler.class);
         contribution.addBinding().to(DeleteMessageHandler.class);
         contribution.addBinding().to(DeleteMessageOccurrenceHandler.class);
         // contribution.addBinding().to(DeleteDestructionOccurrenceHandler.class);
         contribution.addBinding().to(DeleteExecutionOccurrenceHandler.class);
         contribution.addBinding().to(DeleteBehaviorExecutionHandler.class);
         contribution.addBinding().to(DeleteCombinedFragmentHandler.class);
         contribution.addBinding().to(DeleteInteractionOperandHandler.class);
         contribution.addBinding().to(DeleteInteractionUseHandler.class);

      });
      contributeDiagramUpdateHandlers((contribution) -> {
         contribution.addBinding().to(UpdateInteractionHandler.class);
         contribution.addBinding().to(UpdateLifelineHandler.class);
         contribution.addBinding().to(UpdateBehaviorExecutionHandler.class);
         contribution.addBinding().to(UpdateMessageHandler.class);
         contribution.addBinding().to(UpdateMessageOccurrenceHandler.class);
         // contribution.addBinding().to(UpdateDestructionOccurrenceHandler.class);
         contribution.addBinding().to(UpdateExecutionOccurrenceHandler.class);
         contribution.addBinding().to(UpdateCombinedFragmentHandler.class);
         contribution.addBinding().to(UpdateInteractionOperandHandler.class);
         contribution.addBinding().to(UpdateInteractionUseHandler.class);

      });
      contributeDiagramLabelEditMappers((contribution) -> {
         contribution.addBinding().to(InteractionLabelEditMapper.class);
         contribution.addBinding().to(LifelineLabelEditMapper.class);
         contribution.addBinding().to(MessageLabelEditMapper.class);
         contribution.addBinding().to(InteractionOperandLabelEditMapper.class);
      });
      contributeGModelMappers((contribution) -> {
         contribution.addBinding().to(InteractionNodeMapper.class);
         contribution.addBinding().to(LifelineNodeMapper.class);
         contribution.addBinding().to(MessageEdgeMapper.class);

         contribution.addBinding().to(BehaviorExecutionNodeMapper.class);

         contribution.addBinding().to(MessageOccurrenceNodeMapper.class);
         contribution.addBinding().to(DestructionOccurrenceNodeMapper.class);
         contribution.addBinding().to(ExecutionOccurrenceNodeMapper.class);

         contribution.addBinding().to(CombinedFragmentNodeMapper.class);
         contribution.addBinding().to(InteractionOperandNodeMapper.class);

         contribution.addBinding().to(InteractionUseNodeMapper.class);

         contribution.addBinding().to(MessageAnchorNodeMapper.class);

      });
      contributeDiagramElementPropertyMappers((contribution) -> {
         contribution.addBinding().to(InteractionPropertyMapper.class);
         contribution.addBinding().to(LifelinePropertyMapper.class);
         contribution.addBinding().to(MessagePropertyMapper.class);
         contribution.addBinding().to(BehaviourExecutionPropertyMapper.class);
         contribution.addBinding().to(CombinedFragmentPropertyMapper.class);
         contribution.addBinding().to(InteractionOperandPropertyMapper.class);
         contribution.addBinding().to(InteractionUsePropertyMapper.class);

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
