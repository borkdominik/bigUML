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
package com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.features.tool_palette;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.eclipsesource.uml.glsp.core.features.tool_palette.PaletteItemUtil;
import com.eclipsesource.uml.glsp.core.features.tool_palette.ToolPaletteConfiguration;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_BehaviorExecution;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_CombinedFragment;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_DestructionOccurrence;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_ExecutionOccurrence;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_Interaction;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_InteractionOperand;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_InteractionUse;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_Lifeline;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_Message;
import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_MessageOccurrence;
import com.google.common.collect.Lists;

public class SequenceToolPaletteConfiguration implements ToolPaletteConfiguration {

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      var palette = Lists.newArrayList(nodes(), edges());
      PaletteItemUtil.sortAsListed(palette);
      return palette;
   }

   private PaletteItem nodes() {
      PaletteItem createInteraction = PaletteItemUtil.node(UmlSequence_Interaction.typeId(), "Interaction",
         "uml-interaction-icon");

      PaletteItem createCombinedFragment = PaletteItemUtil.node(UmlSequence_CombinedFragment.typeId(),
         "Combined Fragment",
         "uml-combined-fragment-icon");

      PaletteItem createInteractionOperand = PaletteItemUtil.node(UmlSequence_InteractionOperand.typeId(),
         "Interaction Operand",
         "uml-interaction-operand-icon");

      PaletteItem createLifeline = PaletteItemUtil.node(UmlSequence_Lifeline.typeId(), "Lifeline", "uml-lifeline-icon");

      PaletteItem createExecution = PaletteItemUtil.node(UmlSequence_BehaviorExecution.typeId(), "Behaviour Execution",
         "uml-behavior-execution-specification-icon");

      PaletteItem createInteractionUse = PaletteItemUtil.node(UmlSequence_InteractionUse.typeId(),
         "Interaction Use",
         "uml-interaction-use-icon");

      PaletteItem createOccurence = PaletteItemUtil.node(UmlSequence_MessageOccurrence.typeId(), "Occurrence",
         "uml-occurrence-specification-icon");

      PaletteItem createExecutionOccurence = PaletteItemUtil.node(UmlSequence_ExecutionOccurrence.typeId(),
         "ExecutionOccurrence",
         "uml-execution-occurrence-specification-icon");

      PaletteItem createDestructionOccurence = PaletteItemUtil.node(UmlSequence_DestructionOccurrence.typeId(),
         "DestructionOccurrence",
         "uml-destruction-event-icon");

      List<PaletteItem> nodes = Lists.newArrayList(
         createInteraction,
         createLifeline,
         createCombinedFragment,
         createInteractionOperand,
         // createOccurence, // for debugging
         // createExecution,
         createInteractionUse);
      PaletteItemUtil.sortAsListed(nodes);
      return PaletteItem.createPaletteGroup("uml.classifier", "Nodes", nodes, "versions");
   }

   private PaletteItem edges() {
      // createAsyncCallMessage(----->[]<- - - -): creates a Message from LlA to LlB
      PaletteItem createAsyncCallMessage = PaletteItemUtil.edge(UmlSequence_Message.typeId(), "Async Call Message",
         "uml-message-asynch-call-icon");
      // createSyncCallMessage(----->): creates a Message from LlA to LlB
      PaletteItem createSyncCallMessage = PaletteItemUtil.edge(UmlSequence_Message.Variant.syncTypeId(),
         "Sync Call Message",
         "uml-message-synch-call-icon");
      // createReplyCallMessage(- - ->): creates a Message from LlA to LlB
      PaletteItem replyMessage = PaletteItemUtil.edge(UmlSequence_Message.Variant.replyTypeId(), "Reply Message",
         "uml-message-reply-icon");
      // createMessage (----->) creates a Message from LlA to the header of LlB
      PaletteItem createMessage = PaletteItemUtil.edge(UmlSequence_Message.Variant.createTypeId(), "Message Create",
         "uml-message-create-message-icon");
      // createMessage (----->) creates a Message from LlA to the header of LlB
      PaletteItem deleteMessage = PaletteItemUtil.edge(UmlSequence_Message.Variant.deleteTypeId(), "Message Delete",
         "uml-message-delete-message-icon");
      PaletteItem foundMessage = PaletteItemUtil.edge(UmlSequence_Message.Variant.foundTypeId(), "Found Message",
         "uml-message-icon");
      PaletteItem lostMessage = PaletteItemUtil.edge(UmlSequence_Message.Variant.lostTypeId(), "Lost Message",
         "uml-message-icon");

      List<PaletteItem> edges = Lists.newArrayList(createAsyncCallMessage, createSyncCallMessage, replyMessage,
         createMessage, deleteMessage, foundMessage, lostMessage);

      PaletteItemUtil.sortAsListed(edges);
      return PaletteItem.createPaletteGroup("uml.relation", "Edges", edges, "export");
   }
}
