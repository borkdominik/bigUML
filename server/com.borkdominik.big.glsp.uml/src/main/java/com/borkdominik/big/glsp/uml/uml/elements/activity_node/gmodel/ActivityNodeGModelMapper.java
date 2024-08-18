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
package com.borkdominik.big.glsp.uml.uml.elements.activity_node.gmodel;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.uml2.uml.AcceptEventAction;
import org.eclipse.uml2.uml.ActivityFinalNode;
import org.eclipse.uml2.uml.ActivityNode;
import org.eclipse.uml2.uml.ActivityParameterNode;
import org.eclipse.uml2.uml.CentralBufferNode;
import org.eclipse.uml2.uml.DecisionNode;
import org.eclipse.uml2.uml.FlowFinalNode;
import org.eclipse.uml2.uml.ForkNode;
import org.eclipse.uml2.uml.InitialNode;
import org.eclipse.uml2.uml.JoinNode;
import org.eclipse.uml2.uml.MergeNode;
import org.eclipse.uml2.uml.OpaqueAction;
import org.eclipse.uml2.uml.SendSignalAction;

import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.gmodel.BGEMFElementGModelMapper;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.uml.elements.activity_node.gmodel.actions.GActionBuilder;
import com.borkdominik.big.glsp.uml.uml.elements.activity_node.gmodel.control_nodes.GControlNodeBuilder;
import com.borkdominik.big.glsp.uml.uml.elements.activity_node.gmodel.object_nodes.GObjectNodeBuilder;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ActivityNodeGModelMapper extends BGEMFElementGModelMapper<ActivityNode, GNode> {

   @Inject
   public ActivityNodeGModelMapper(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);
   }

   @Override
   public GNode map(final ActivityNode source) {
      // Actions
      if (source instanceof AcceptEventAction s) {
         return new GActionBuilder<>(gcmodelContext, s, UMLTypes.ACCEPT_EVENT_ACTION.prefix(representation))
            .buildGModel();
      } else if (source instanceof OpaqueAction s) {
         return new GActionBuilder<>(gcmodelContext, s, UMLTypes.OPAQUE_ACTION.prefix(representation))
            .buildGModel();
      } else if (source instanceof SendSignalAction s) {
         return new GActionBuilder<>(gcmodelContext, s, UMLTypes.SEND_SIGNAL_ACTION.prefix(representation))
            .buildGModel();
         // Control Nodes
      } else if (source instanceof ActivityFinalNode s) {
         return new GControlNodeBuilder<>(gcmodelContext, s, UMLTypes.ACTIVITY_FINAL_NODE.prefix(representation))
            .buildGModel();
      } else if (source instanceof DecisionNode s) {
         return new GControlNodeBuilder<>(gcmodelContext, s, UMLTypes.DECISION_NODE.prefix(representation))
            .buildGModel();
      } else if (source instanceof FlowFinalNode s) {
         return new GControlNodeBuilder<>(gcmodelContext, s, UMLTypes.FLOW_FINAL_NODE.prefix(representation))
            .buildGModel();
      } else if (source instanceof ForkNode s) {
         return new GControlNodeBuilder<>(gcmodelContext, s, UMLTypes.FORK_NODE.prefix(representation))
            .buildGModel();
      } else if (source instanceof InitialNode s) {
         return new GControlNodeBuilder<>(gcmodelContext, s, UMLTypes.INITIAL_NODE.prefix(representation))
            .buildGModel();
      } else if (source instanceof JoinNode s) {
         return new GControlNodeBuilder<>(gcmodelContext, s, UMLTypes.JOIN_NODE.prefix(representation))
            .buildGModel();
      } else if (source instanceof MergeNode s) {
         return new GControlNodeBuilder<>(gcmodelContext, s, UMLTypes.MERGE_NODE.prefix(representation))
            .buildGModel();
         // Object Nodes
      } else if (source instanceof CentralBufferNode s) {
         return new GObjectNodeBuilder<>(gcmodelContext, s, UMLTypes.CENTRAL_BUFFER_NODE.prefix(representation))
            .buildGModel();
      } else if (source instanceof ActivityParameterNode s) {
         return new GObjectNodeBuilder<>(gcmodelContext, s, UMLTypes.ACTIVITY_PARAMETER_NODE.prefix(representation))
            .buildGModel();
      }

      return new GActivityNodeBuilder<>(gcmodelContext, source, UMLTypes.ACTIVITY_NODE.prefix(representation))
         .buildGModel();
   }

   @Override
   public List<GModelElement> mapSiblings(final ActivityNode source) {
      var siblings = new ArrayList<GModelElement>();

      return siblings;
   }

}
