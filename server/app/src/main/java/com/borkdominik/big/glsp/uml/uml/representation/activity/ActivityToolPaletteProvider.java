/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.representation.activity;

import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;

import com.borkdominik.big.glsp.server.core.features.tool_palette.BGBaseToolPaletteProvider;
import com.borkdominik.big.glsp.server.core.features.tool_palette.BGPaletteItemUtil;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.unotation.Representation;

public class ActivityToolPaletteProvider extends BGBaseToolPaletteProvider {
   public ActivityToolPaletteProvider() {
      super(Representation.ACTIVITY);
   }

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return List.of(containers(), actions(), controlNodes(), objectNodes(), edges());
   }

   private PaletteItem containers() {
      var containers = List.of(
         BGPaletteItemUtil.node(UMLTypes.ACTIVITY.prefix(representation), "Activity", "uml-activity-icon"),
         BGPaletteItemUtil.node(UMLTypes.ACTIVITY_PARTITION.prefix(representation), "Activity Partition",
            "uml-activity-partition-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Container", containers, "symbol-property");
   }

   private PaletteItem actions() {
      var actions = List.of(
         BGPaletteItemUtil.node(UMLTypes.OPAQUE_ACTION.prefix(representation), "Action", "uml-opaque-action-icon"),
         BGPaletteItemUtil.node(UMLTypes.SEND_SIGNAL_ACTION.prefix(representation), "Send Signal Action",
            "uml-send-signal-action-icon"),
         BGPaletteItemUtil.node(UMLTypes.ACCEPT_EVENT_ACTION.prefix(representation), "Accept Event Action",
            "uml-accept-event-action-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Actions", actions, "symbol-property");
   }

   private PaletteItem controlNodes() {
      var controlNodes = List.of(
         BGPaletteItemUtil.node(UMLTypes.INITIAL_NODE.prefix(representation), "Initial Node", "uml-initial-node-icon"),
         BGPaletteItemUtil.node(UMLTypes.DECISION_NODE.prefix(representation), "Decision Node",
            "uml-decision-node-icon"),
         BGPaletteItemUtil.node(UMLTypes.MERGE_NODE.prefix(representation), "Merge Node", "uml-merge-node-icon"),
         BGPaletteItemUtil.node(UMLTypes.JOIN_NODE.prefix(representation), "Join Node", "uml-join-node-icon"),
         BGPaletteItemUtil.node(UMLTypes.FORK_NODE.prefix(representation), "Fork Node", "uml-fork-node-icon"),
         BGPaletteItemUtil.node(UMLTypes.ACTIVITY_FINAL_NODE.prefix(representation), "Activity Final Node",
            "uml-activity-final-node-icon"),
         BGPaletteItemUtil.node(UMLTypes.FLOW_FINAL_NODE.prefix(representation), "Flow Final Node",
            "uml-flow-final-node-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Control Nodes", controlNodes, "symbol-property");
   }

   private PaletteItem objectNodes() {
      var objectNodes = List.of(
         BGPaletteItemUtil.node(UMLTypes.CENTRAL_BUFFER_NODE.prefix(representation), "Central Buffer Node",
            "uml-central-buffer-node-icon"),
         BGPaletteItemUtil.node(UMLTypes.INPUT_PIN.prefix(representation), "Input Pin", "uml-input-pin-icon"),
         BGPaletteItemUtil.node(UMLTypes.OUTPUT_PIN.prefix(representation), "Output Pin", "uml-output-pin-icon"),
         BGPaletteItemUtil.node(UMLTypes.ACTIVITY_PARAMETER_NODE.prefix(representation), "Activity Parameter",
            "uml-activity-parameter-node-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Object Nodes", objectNodes, "symbol-property");
   }

   private PaletteItem edges() {
      var edges = List.of(
         BGPaletteItemUtil.edge(UMLTypes.CONTROL_FLOW.prefix(representation), "Edge", "uml-control-flow-icon"));

      return PaletteItem.createPaletteGroup("uml.classifier", "Edges", edges, "symbol-property");
   }
}
