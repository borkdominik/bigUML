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
package com.eclipsesource.uml.glsp.uml.activity_diagram;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.actions.TriggerEdgeCreationAction;
import org.eclipse.glsp.server.actions.TriggerNodeCreationAction;
import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.google.common.collect.Lists;

public class ActivityPalette {

   public List<PaletteItem> getItems(final Map<String, String> args) {
      return Lists.newArrayList(classifiersActivity(), actionsActivity(),
         relationsActivity(), controlNodesActivity(), dataActivity(), annotationsActivity(), comment());
   }

   private PaletteItem classifiersActivity() {
      PaletteItem createActivity = node(Types.ACTIVITY, "Activity", "umlactivity");
      PaletteItem createPartition = node(Types.PARTITION, "Partition", "umlpartition");
      PaletteItem region = node(Types.INTERRUPTIBLEREGION, "Interruptible Region", "umlinterruptibleregion");

      List<PaletteItem> classifiers = Lists.newArrayList(createActivity, createPartition, region);
      return PaletteItem.createPaletteGroup("uml.classifier", "Container", classifiers, "symbol-property");
   }

   private PaletteItem relationsActivity() {
      PaletteItem createControlFlor = edge(Types.CONTROLFLOW, "Control Flow", "umlcontrolflow");
      PaletteItem exceptionHandler = edge(Types.EXCEPTIONHANDLER, "Exception Handler", "umlexceptionhandler");

      List<PaletteItem> edges = Lists.newArrayList(createControlFlor, exceptionHandler);
      return PaletteItem.createPaletteGroup("uml.relation", "Flow", edges, "symbol-property");
   }

   private PaletteItem actionsActivity() {
      PaletteItem createOpaque = node(Types.ACTION, "Action", "umlaction");
      PaletteItem createAcceptEvent = node(Types.ACCEPTEVENT, "Event", "umlevent");
      PaletteItem createTimeEvent = node(Types.TIMEEVENT, "Time Event", "umltime");
      PaletteItem createSendSignal = node(Types.SENDSIGNAL, "Signal", "umlsignal");
      PaletteItem createCall = node(Types.CALL, "Call", "umlcall");

      List<PaletteItem> features = Lists.newArrayList(createOpaque, createAcceptEvent, createTimeEvent,
         createSendSignal, createCall);

      return PaletteItem.createPaletteGroup("uml.feature", "Actions", features, "symbol-property");
   }

   private PaletteItem annotationsActivity() {
      // ACTIVITY
      PaletteItem precondition = node(Types.CONDITION, "Condition", "umlcondition");

      List<PaletteItem> features = Lists.newArrayList(precondition);

      return PaletteItem.createPaletteGroup("uml.feature", "Annotations", features, "symbol-property");
   }

   private PaletteItem dataActivity() {
      // ACTIVITY
      PaletteItem par = node(Types.PARAMETER, "Parameter", "umlparameter");
      PaletteItem pin = node(Types.PIN, "Pin", "umlpin");
      PaletteItem cb = node(Types.CENTRALBUFFER, "Central Buffer", "umlcentralbuffer");
      PaletteItem ds = node(Types.DATASTORE, "Datastore", "umldatastore");

      List<PaletteItem> features = Lists.newArrayList(par, pin, cb, ds);

      return PaletteItem.createPaletteGroup("uml.feature", "Data", features, "symbol-property");
   }

   private PaletteItem controlNodesActivity() {

      List<PaletteItem> controlNodes = Lists.newArrayList(
         node(Types.INITIALNODE, "Initial", "umlinitial"),
         node(Types.FINALNODE, "Final", "umlfinal"),
         node(Types.FLOWFINALNODE, "Flow Final", "umlflowfinal"),
         node(Types.DECISIONMERGENODE, "Decision/Merge", "umldecision"),
         node(Types.FORKJOINNODE, "Fork/Join", "umlfork"));

      return PaletteItem.createPaletteGroup("uml.feature", "Control Nodes", controlNodes, "symbol-property");
   }

   private PaletteItem comment() {
      PaletteItem createCommentNode = node(Types.COMMENT, "Comment", "umlcomment");
      // PaletteItem createCommentEdge = node(Types.COMMENT_EDGE, "Comment Edge", "umlcommentedge");

      List<PaletteItem> comment = Lists.newArrayList(createCommentNode);
      return PaletteItem.createPaletteGroup("uml.comment", "Comment", comment, "symbol-property");
   }

   private PaletteItem node(final String elementTypeId, final String label, final String icon) {
      return new PaletteItem(elementTypeId, label, new TriggerNodeCreationAction(elementTypeId), icon);
   }

   private PaletteItem edge(final String elementTypeId, final String label, final String icon) {
      return new PaletteItem(elementTypeId, label, new TriggerEdgeCreationAction(elementTypeId), icon);
   }

}
