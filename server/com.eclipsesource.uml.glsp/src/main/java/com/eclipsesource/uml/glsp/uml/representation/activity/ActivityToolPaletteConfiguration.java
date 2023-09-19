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
package com.eclipsesource.uml.glsp.uml.representation.activity;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.eclipse.glsp.server.features.toolpalette.PaletteItem;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.ActivityNode;
import org.eclipse.uml2.uml.ActivityPartition;
import org.eclipse.uml2.uml.ControlFlow;
import org.eclipse.uml2.uml.InputPin;
import org.eclipse.uml2.uml.OutputPin;

import com.eclipsesource.uml.glsp.core.features.tool_palette.PaletteItemUtil;
import com.eclipsesource.uml.glsp.uml.elements.activity_node.ActivityNodeConfiguration;
import com.eclipsesource.uml.glsp.uml.features.tool_palette.RepresentationToolPaletteConfiguration;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class ActivityToolPaletteConfiguration extends RepresentationToolPaletteConfiguration {
   public ActivityToolPaletteConfiguration() {
      super(Representation.ACTIVITY);
   }

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      return containers();
   }

   private List<PaletteItem> containers() {
      var palette = new ArrayList<PaletteItem>();

      var containers = List.of(
         PaletteItemUtil.node(configurationFor(Activity.class).typeId(), "Activity", "uml-activity-icon"),
         PaletteItemUtil.node(configurationFor(ActivityPartition.class).typeId(), "Activity Partition",
            "uml-activity-partition-icon"));

      palette.add(PaletteItem.createPaletteGroup("uml.classifier", "Container", containers, "symbol-property"));

      var actions = List.of(
         PaletteItemUtil.node(
            configurationFor(ActivityNode.class, ActivityNodeConfiguration.class).opaqueActionTypeId(), "Action",
            "uml-opaque-action-icon"),
         PaletteItemUtil.node(
            configurationFor(ActivityNode.class, ActivityNodeConfiguration.class).sendSignalActionTypeId(),
            "Send Signal Action",
            "uml-send-signal-action-icon"),
         PaletteItemUtil.node(
            configurationFor(ActivityNode.class, ActivityNodeConfiguration.class).acceptEventActionTypeId(),
            "Accept Event Action",
            "uml-accept-event-action-icon"));

      palette.add(PaletteItem.createPaletteGroup("uml.classifier", "Actions", actions, "symbol-property"));

      var control_nodes = List.of(
         PaletteItemUtil.node(configurationFor(ActivityNode.class, ActivityNodeConfiguration.class).initialNodeTypeId(),
            "Initial Node", "uml-initial-node-icon"),
         PaletteItemUtil.node(
            configurationFor(ActivityNode.class, ActivityNodeConfiguration.class).decisionNodeTypeId(),
            "Decision Node", "uml-decision-node-icon"),
         PaletteItemUtil.node(configurationFor(ActivityNode.class, ActivityNodeConfiguration.class).mergeNodeTypeId(),
            "Merge Node", "uml-merge-node-icon"),
         PaletteItemUtil.node(configurationFor(ActivityNode.class, ActivityNodeConfiguration.class).joinNodeTypeId(),
            "Join Node", "uml-join-node-icon"),
         PaletteItemUtil.node(configurationFor(ActivityNode.class, ActivityNodeConfiguration.class).forkNodeTypeId(),
            "Fork Node", "uml-fork-node-icon"),
         PaletteItemUtil.node(
            configurationFor(ActivityNode.class, ActivityNodeConfiguration.class).activityFinalNodeTypeId(),
            "Activity Final Node",
            "uml-activity-final-node-icon"),
         PaletteItemUtil.node(
            configurationFor(ActivityNode.class, ActivityNodeConfiguration.class).flowFinalNodeTypeId(),
            "Flow Final Node",
            "uml-flow-final-node-icon"));

      palette.add(PaletteItem.createPaletteGroup("uml.classifier", "Control Nodes", control_nodes, "symbol-property"));

      var object_nodes = List.of(
         PaletteItemUtil.node(
            configurationFor(ActivityNode.class, ActivityNodeConfiguration.class).centralBufferNodeTypeId(),
            "Central Buffer Node",
            "uml-central-buffer-node-icon"),
         PaletteItemUtil.node(configurationFor(InputPin.class).typeId(), "Input Pin",
            "uml-input-pin-icon"),
         PaletteItemUtil.node(configurationFor(OutputPin.class).typeId(), "Output Pin",
            "uml-output-pin-icon"),
         PaletteItemUtil.node(
            configurationFor(ActivityNode.class, ActivityNodeConfiguration.class).activityParameterNodeTypeId(),
            "Activity Parameter",
            "uml-activity-parameter-node-icon"));

      palette.add(PaletteItem.createPaletteGroup("uml.classifiert", "Object Nodes", object_nodes, "symbol-property"));

      var edges = List.of(
         PaletteItemUtil.edge(configurationFor(ControlFlow.class).typeId(), "Edge", "uml-control-flow-icon"));

      palette.add(PaletteItem.createPaletteGroup("uml.classifier", "Edges", edges, "symbol-property"));

      return palette;
   }
}
