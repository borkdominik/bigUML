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
package com.eclipsesource.uml.glsp.uml.elements.activity_node;

import com.eclipsesource.uml.glsp.uml.configuration.di.NodeConfigurationFactory;
import com.eclipsesource.uml.glsp.uml.elements.activity_node.gmodel.actions.AcceptEventActionNodeMapper;
import com.eclipsesource.uml.glsp.uml.elements.activity_node.gmodel.actions.OpaqueActionNodeMapper;
import com.eclipsesource.uml.glsp.uml.elements.activity_node.gmodel.actions.SendSignalActionNodeMapper;
import com.eclipsesource.uml.glsp.uml.elements.activity_node.gmodel.control_nodes.ActivityFinalNodeMapper;
import com.eclipsesource.uml.glsp.uml.elements.activity_node.gmodel.control_nodes.DecisionNodeMapper;
import com.eclipsesource.uml.glsp.uml.elements.activity_node.gmodel.control_nodes.FlowFinalNodeMapper;
import com.eclipsesource.uml.glsp.uml.elements.activity_node.gmodel.control_nodes.ForkNodeMapper;
import com.eclipsesource.uml.glsp.uml.elements.activity_node.gmodel.control_nodes.InitialNodeMapper;
import com.eclipsesource.uml.glsp.uml.elements.activity_node.gmodel.control_nodes.JoinNodeMapper;
import com.eclipsesource.uml.glsp.uml.elements.activity_node.gmodel.control_nodes.MergeNodeMapper;
import com.eclipsesource.uml.glsp.uml.elements.activity_node.gmodel.object_nodes.ActivityParameterMapper;
import com.eclipsesource.uml.glsp.uml.elements.activity_node.gmodel.object_nodes.CentralBufferNodeMapper;
import com.eclipsesource.uml.glsp.uml.elements.actor.features.ActorLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.elements.actor.features.ActorPropertyMapper;
import com.eclipsesource.uml.glsp.uml.features.label_edit.di.LabelEditMapperFactory;
import com.eclipsesource.uml.glsp.uml.features.property_palette.di.PropertyMapperFactory;
import com.eclipsesource.uml.glsp.uml.handler.di.NodeOperationHandlerFactory;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public interface ActivityNodeFactory
   extends NodeConfigurationFactory, NodeOperationHandlerFactory, PropertyMapperFactory,
   LabelEditMapperFactory {
   @Override
   ActivityNodeConfiguration nodeConfiguration(Representation representation);

   @Override
   ActivityNodeOperationHandler nodeOperationHandler(Representation representation);

   @Override
   ActorLabelEditMapper labelEditMapper(Representation representation);

   @Override
   ActorPropertyMapper elementPropertyMapper(Representation representation);

   // Actions
   AcceptEventActionNodeMapper acceptEventActionNodeMapper(Representation representation);

   OpaqueActionNodeMapper opaqueActionNodeMapper(Representation representation);

   SendSignalActionNodeMapper sendSignalActionNodeMapper(Representation representation);

   // Control Nodes
   ActivityFinalNodeMapper activityFinalNodeMapper(Representation representation);

   DecisionNodeMapper decisionNodeMapper(Representation representation);

   FlowFinalNodeMapper flowFinalNodeMapper(Representation representation);

   ForkNodeMapper forkNodeMapper(Representation representation);

   InitialNodeMapper initialNodeMapper(Representation representation);

   JoinNodeMapper joinNodeMapper(Representation representation);

   MergeNodeMapper mergeNodeMapper(Representation representation);

   // Object Nodes
   ActivityParameterMapper activityParameterMapper(Representation representation);

   CentralBufferNodeMapper centralBufferNodeMapper(Representation representation);
}
