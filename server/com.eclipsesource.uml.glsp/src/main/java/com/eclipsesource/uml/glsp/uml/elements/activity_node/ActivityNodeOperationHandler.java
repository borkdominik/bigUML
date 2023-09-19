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

import java.util.Set;

import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.AcceptEventAction;
import org.eclipse.uml2.uml.ActivityFinalNode;
import org.eclipse.uml2.uml.ActivityNode;
import org.eclipse.uml2.uml.ActivityParameterNode;
import org.eclipse.uml2.uml.CentralBufferNode;
import org.eclipse.uml2.uml.DecisionNode;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.FlowFinalNode;
import org.eclipse.uml2.uml.ForkNode;
import org.eclipse.uml2.uml.InitialNode;
import org.eclipse.uml2.uml.JoinNode;
import org.eclipse.uml2.uml.MergeNode;
import org.eclipse.uml2.uml.OpaqueAction;
import org.eclipse.uml2.uml.SendSignalAction;

import com.eclipsesource.uml.glsp.uml.configuration.ElementConfigurationRegistry;
import com.eclipsesource.uml.glsp.uml.handler.element.NodeOperationHandler;
import com.eclipsesource.uml.modelserver.uml.elements.activity_node.commands.CreateActivityNodeArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ActivityNodeOperationHandler extends NodeOperationHandler<ActivityNode, Element> {
   @Override
   public Set<Class<? extends ActivityNode>> getElementTypes() {
      return Set.of(getElementType(), OpaqueAction.class, AcceptEventAction.class, SendSignalAction.class,
         ActivityFinalNode.class, DecisionNode.class, FlowFinalNode.class, ForkNode.class, InitialNode.class,
         JoinNode.class, MergeNode.class, ActivityParameterNode.class, CentralBufferNode.class);
   }

   @Inject
   public ActivityNodeOperationHandler(@Assisted final Representation representation,
      final ElementConfigurationRegistry registry) {
      super(representation, registry.accessTyped(representation, ActivityNode.class).allTypeIds());
   }

   @Override
   protected CreateActivityNodeArgument createArgument(final CreateNodeOperation operation, final Element parent) {
      var typeId = operation.getElementTypeId();
      var configuration = configuration(ActivityNodeConfiguration.class);

      if (typeId.equals(configuration.acceptEventActionTypeId())) {
         return new CreateActivityNodeArgument(AcceptEventAction.class);
      } else if (typeId.equals(configuration.opaqueActionTypeId())) {
         return new CreateActivityNodeArgument(OpaqueAction.class);
      } else if (typeId.equals(configuration.sendSignalActionTypeId())) {
         return new CreateActivityNodeArgument(SendSignalAction.class);
      } else if (typeId.equals(configuration.activityFinalNodeTypeId())) {
         return new CreateActivityNodeArgument(ActivityFinalNode.class);
      } else if (typeId.equals(configuration.decisionNodeTypeId())) {
         return new CreateActivityNodeArgument(DecisionNode.class);
      } else if (typeId.equals(configuration.flowFinalNodeTypeId())) {
         return new CreateActivityNodeArgument(FlowFinalNode.class);
      } else if (typeId.equals(configuration.forkNodeTypeId())) {
         return new CreateActivityNodeArgument(ForkNode.class);
      } else if (typeId.equals(configuration.initialNodeTypeId())) {
         return new CreateActivityNodeArgument(InitialNode.class);
      } else if (typeId.equals(configuration.joinNodeTypeId())) {
         return new CreateActivityNodeArgument(JoinNode.class);
      } else if (typeId.equals(configuration.mergeNodeTypeId())) {
         return new CreateActivityNodeArgument(MergeNode.class);
      } else if (typeId.equals(configuration.activityParameterNodeTypeId())) {
         return new CreateActivityNodeArgument(ActivityParameterNode.class);
      } else if (typeId.equals(configuration.centralBufferNodeTypeId())) {
         return new CreateActivityNodeArgument(CentralBufferNode.class);
      }

      throw new IllegalStateException();
   }

}
