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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.manifest;

import org.eclipse.emfcloud.modelserver.edit.CommandContribution;

import com.eclipsesource.uml.modelserver.core.manifest.DiagramManifest;
import com.eclipsesource.uml.modelserver.core.manifest.contributions.CommandCodecContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.behaviorExecution.CreateBehaviorExecutionContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.behaviorExecution.DeleteBehaviorExecutionContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.behaviorExecution.UpdateBehaviorExecutionContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.combined_fragment.CreateCombinedFragmentContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.combined_fragment.DeleteCombinedFragmentContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.combined_fragment.UpdateCombinedFragmentContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.destructionOccurrence.CreateDestructionOccurrenceContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.destructionOccurrence.DeleteDestructionOccurenceContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.destructionOccurrence.UpdateDestructionOccurrenceContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.executionOccurrence.CreateExecutionOccurrenceContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.executionOccurrence.DeleteExecutionOccurenceContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.executionOccurrence.UpdateExecutionOccurrenceContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.interaction.CreateInteractionContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.interaction.DeleteInteractionContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.interaction.UpdateInteractionContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.interaction_operand.CreateInteractionOperandContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.interaction_operand.DeleteInteractionOperandContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.interaction_operand.UpdateInteractionOperandContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.interaction_use.CreateInteractionUseContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.interaction_use.DeleteInteractionUseContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.interaction_use.UpdateInteractionUseContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.lifeline.CreateLifelineContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.lifeline.DeleteLifelineContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.lifeline.UpdateLifelineContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.message.CreateMessageContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.message.DeleteMessageContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.message.UpdateMessageContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.messageOccurrence.CreateMessageOccurrenceContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.messageOccurrence.DeleteMessageOccurenceContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.messageOccurrence.UpdateMessageOccurrenceContribution;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.multibindings.MapBinder;

public class SequenceManifest extends DiagramManifest implements CommandCodecContribution {
   public SequenceManifest() {
      super(Representation.SEQUENCE);
   }

   @Override
   protected void configure() {
      super.configure();
      contributeCommandCodec(binder(), this::contributeCommandCodec);
   }

   public void contributeCommandCodec(final MapBinder<String, CommandContribution> multibinder) {

      // Interaction
      multibinder.addBinding(CreateInteractionContribution.TYPE).to(CreateInteractionContribution.class);
      multibinder.addBinding(DeleteInteractionContribution.TYPE).to(DeleteInteractionContribution.class);
      multibinder.addBinding(UpdateInteractionContribution.TYPE).to(UpdateInteractionContribution.class);

      // Lifeline
      multibinder.addBinding(CreateLifelineContribution.TYPE).to(CreateLifelineContribution.class);
      multibinder.addBinding(DeleteLifelineContribution.TYPE).to(DeleteLifelineContribution.class);
      multibinder.addBinding(UpdateLifelineContribution.TYPE).to(UpdateLifelineContribution.class);

      // MessageOccurrence
      multibinder.addBinding(CreateMessageOccurrenceContribution.TYPE).to(CreateMessageOccurrenceContribution.class);
      multibinder.addBinding(DeleteMessageOccurenceContribution.TYPE).to(DeleteMessageOccurenceContribution.class);
      multibinder.addBinding(UpdateMessageOccurrenceContribution.TYPE).to(UpdateMessageOccurrenceContribution.class);

      // DestructionOccurrence
      multibinder.addBinding(CreateDestructionOccurrenceContribution.TYPE)
         .to(CreateDestructionOccurrenceContribution.class);
      multibinder.addBinding(DeleteDestructionOccurenceContribution.TYPE)
         .to(DeleteDestructionOccurenceContribution.class);
      multibinder.addBinding(UpdateDestructionOccurrenceContribution.TYPE)
         .to(UpdateDestructionOccurrenceContribution.class);

      // BehaviorExecution
      multibinder.addBinding(CreateBehaviorExecutionContribution.TYPE).to(CreateBehaviorExecutionContribution.class);
      multibinder.addBinding(DeleteBehaviorExecutionContribution.TYPE).to(DeleteBehaviorExecutionContribution.class);
      multibinder.addBinding(UpdateBehaviorExecutionContribution.TYPE).to(UpdateBehaviorExecutionContribution.class);

      // ExecutionOccurrence
      multibinder.addBinding(CreateExecutionOccurrenceContribution.TYPE)
         .to(CreateExecutionOccurrenceContribution.class);
      multibinder.addBinding(DeleteExecutionOccurenceContribution.TYPE).to(DeleteExecutionOccurenceContribution.class);
      multibinder.addBinding(UpdateExecutionOccurrenceContribution.TYPE)
         .to(UpdateExecutionOccurrenceContribution.class);

      // Message
      multibinder.addBinding(CreateMessageContribution.TYPE).to(CreateMessageContribution.class);
      multibinder.addBinding(DeleteMessageContribution.TYPE).to(DeleteMessageContribution.class);
      multibinder.addBinding(UpdateMessageContribution.TYPE).to(UpdateMessageContribution.class);

      // CombinedFragment
      multibinder.addBinding(CreateCombinedFragmentContribution.TYPE).to(CreateCombinedFragmentContribution.class);
      multibinder.addBinding(DeleteCombinedFragmentContribution.TYPE).to(DeleteCombinedFragmentContribution.class);
      multibinder.addBinding(UpdateCombinedFragmentContribution.TYPE).to(UpdateCombinedFragmentContribution.class);

      // InteractionOperand
      multibinder.addBinding(CreateInteractionOperandContribution.TYPE).to(CreateInteractionOperandContribution.class);
      multibinder.addBinding(DeleteInteractionOperandContribution.TYPE).to(DeleteInteractionOperandContribution.class);
      multibinder.addBinding(UpdateInteractionOperandContribution.TYPE).to(UpdateInteractionOperandContribution.class);

      // InteractionUse
      multibinder.addBinding(CreateInteractionUseContribution.TYPE).to(CreateInteractionUseContribution.class);
      multibinder.addBinding(DeleteInteractionUseContribution.TYPE).to(DeleteInteractionUseContribution.class);
      multibinder.addBinding(UpdateInteractionUseContribution.TYPE).to(UpdateInteractionUseContribution.class);

   }
}
