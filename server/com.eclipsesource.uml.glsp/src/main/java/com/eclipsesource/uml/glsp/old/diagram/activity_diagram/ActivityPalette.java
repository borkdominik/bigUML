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
package com.eclipsesource.uml.glsp.old.diagram.activity_diagram;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.actions.TriggerEdgeCreationAction;
import org.eclipse.glsp.server.actions.TriggerNodeCreationAction;
import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.eclipsesource.uml.glsp.old.diagram.activity_diagram.constants.ActivityTypes;
import com.google.common.collect.Lists;

public class ActivityPalette {

   public List<PaletteItem> getItems(final Map<String, String> args) {
      return Lists.newArrayList(classifiersActivity(), actionsActivity(),
         relationsActivity(), controlNodesActivity(), dataActivity(), annotationsActivity());
   }

   private PaletteItem classifiersActivity() {
      PaletteItem createActivity = node(ActivityTypes.ACTIVITY, "Activity", "umlactivity");
      PaletteItem createPartition = node(ActivityTypes.PARTITION, "Partition", "umlpartition");
      PaletteItem region = node(ActivityTypes.INTERRUPTIBLEREGION, "Interruptible Region", "umlinterruptibleregion");

      List<PaletteItem> classifiers = Lists.newArrayList(createActivity, createPartition, region);
      return PaletteItem.createPaletteGroup("uml.classifier", "Container", classifiers, "symbol-property");
   }

   private PaletteItem relationsActivity() {
      PaletteItem createControlFlor = edge(ActivityTypes.CONTROLFLOW, "Control Flow", "umlcontrolflow");
      PaletteItem exceptionHandler = edge(ActivityTypes.EXCEPTIONHANDLER, "Exception Handler", "umlexceptionhandler");

      List<PaletteItem> edges = Lists.newArrayList(createControlFlor, exceptionHandler);
      return PaletteItem.createPaletteGroup("uml.relation", "Flow", edges, "symbol-property");
   }

   private PaletteItem actionsActivity() {
      PaletteItem createOpaque = node(ActivityTypes.ACTION, "Action", "umlaction");
      PaletteItem createAcceptEvent = node(ActivityTypes.ACCEPTEVENT, "Event", "umlevent");
      PaletteItem createTimeEvent = node(ActivityTypes.TIMEEVENT, "Time Event", "umltime");
      PaletteItem createSendSignal = node(ActivityTypes.SENDSIGNAL, "Signal", "umlsignal");
      PaletteItem createCall = node(ActivityTypes.CALL, "Call", "umlcall");

      List<PaletteItem> features = Lists.newArrayList(createOpaque, createAcceptEvent, createTimeEvent,
         createSendSignal, createCall);

      return PaletteItem.createPaletteGroup("uml.feature", "Actions", features, "symbol-property");
   }

   private PaletteItem annotationsActivity() {
      // ACTIVITY
      PaletteItem precondition = node(ActivityTypes.CONDITION, "Condition", "umlcondition");

      List<PaletteItem> features = Lists.newArrayList(precondition);

      return PaletteItem.createPaletteGroup("uml.feature", "Annotations", features, "symbol-property");
   }

   private PaletteItem dataActivity() {
      // ACTIVITY
      PaletteItem par = node(ActivityTypes.PARAMETER, "Parameter", "umlparameter");
      PaletteItem pin = node(ActivityTypes.PIN, "Pin", "umlpin");
      PaletteItem cb = node(ActivityTypes.CENTRALBUFFER, "Central Buffer", "umlcentralbuffer");
      PaletteItem ds = node(ActivityTypes.DATASTORE, "Datastore", "umldatastore");

      List<PaletteItem> features = Lists.newArrayList(par, pin, cb, ds);

      return PaletteItem.createPaletteGroup("uml.feature", "Data", features, "symbol-property");
   }

   private PaletteItem controlNodesActivity() {

      List<PaletteItem> controlNodes = Lists.newArrayList(
         node(ActivityTypes.INITIALNODE, "Initial", "umlinitial"),
         node(ActivityTypes.FINALNODE, "Final", "umlfinal"),
         node(ActivityTypes.FLOWFINALNODE, "Flow Final", "umlflowfinal"),
         node(ActivityTypes.DECISIONMERGENODE, "Decision/Merge", "umldecision"),
         node(ActivityTypes.FORKJOINNODE, "Fork/Join", "umlfork"));

      return PaletteItem.createPaletteGroup("uml.feature", "Control Nodes", controlNodes, "symbol-property");
   }

   private PaletteItem node(final String elementTypeId, final String label, final String icon) {
      return new PaletteItem(elementTypeId, label, new TriggerNodeCreationAction(elementTypeId), icon);
   }

   private PaletteItem edge(final String elementTypeId, final String label, final String icon) {
      return new PaletteItem(elementTypeId, label, new TriggerEdgeCreationAction(elementTypeId), icon);
   }

}
