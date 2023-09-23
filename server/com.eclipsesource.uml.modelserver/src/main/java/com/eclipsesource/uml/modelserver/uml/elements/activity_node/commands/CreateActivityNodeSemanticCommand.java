/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.elements.activity_node.commands;

import org.eclipse.uml2.uml.AcceptEventAction;
import org.eclipse.uml2.uml.Activity;
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
import org.eclipse.uml2.uml.UMLPackage;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public final class CreateActivityNodeSemanticCommand extends BaseCreateSemanticChildCommand<Activity, ActivityNode> {

   protected final CreateActivityNodeArgument argument;

   public CreateActivityNodeSemanticCommand(final ModelContext context, final Activity parent,
      final CreateActivityNodeArgument argument) {
      super(context, parent);
      this.argument = argument;
   }

   @Override
   protected ActivityNode createSemanticElement(final Activity parent) {
      var nameGenerator = new ListNameGenerator(ActivityNode.class, parent.getOwnedNodes());
      ActivityNode element;
      // Actions
      if (argument.nodeLiteral.equals(OpaqueAction.class)) {
         element = parent.createOwnedNode(nameGenerator.newName(), UMLPackage.Literals.OPAQUE_ACTION);
      } else if (argument.nodeLiteral.equals(AcceptEventAction.class)) {
         element = parent.createOwnedNode(nameGenerator.newName(), UMLPackage.Literals.ACCEPT_EVENT_ACTION);
      } else if (argument.nodeLiteral.equals(SendSignalAction.class)) {
         element = parent.createOwnedNode(nameGenerator.newName(), UMLPackage.Literals.SEND_SIGNAL_ACTION);
         // Control Nodes
      } else if (argument.nodeLiteral.equals(ActivityFinalNode.class)) {
         element = parent.createOwnedNode(nameGenerator.newName(), UMLPackage.Literals.ACTIVITY_FINAL_NODE);
      } else if (argument.nodeLiteral.equals(DecisionNode.class)) {
         element = parent.createOwnedNode(nameGenerator.newName(), UMLPackage.Literals.DECISION_NODE);
      } else if (argument.nodeLiteral.equals(FlowFinalNode.class)) {
         element = parent.createOwnedNode(nameGenerator.newName(), UMLPackage.Literals.FLOW_FINAL_NODE);
      } else if (argument.nodeLiteral.equals(ForkNode.class)) {
         element = parent.createOwnedNode(nameGenerator.newName(), UMLPackage.Literals.FORK_NODE);
      } else if (argument.nodeLiteral.equals(InitialNode.class)) {
         element = parent.createOwnedNode(nameGenerator.newName(), UMLPackage.Literals.INITIAL_NODE);
      } else if (argument.nodeLiteral.equals(JoinNode.class)) {
         element = parent.createOwnedNode(nameGenerator.newName(), UMLPackage.Literals.JOIN_NODE);
      } else if (argument.nodeLiteral.equals(MergeNode.class)) {
         element = parent.createOwnedNode(nameGenerator.newName(), UMLPackage.Literals.MERGE_NODE);
         // Object Nodes
      } else if (argument.nodeLiteral.equals(ActivityParameterNode.class)) {
         element = parent.createOwnedNode(nameGenerator.newName(), UMLPackage.Literals.ACTIVITY_PARAMETER_NODE);
      } else if (argument.nodeLiteral.equals(CentralBufferNode.class)) {
         element = parent.createOwnedNode(nameGenerator.newName(), UMLPackage.Literals.CENTRAL_BUFFER_NODE);
      } else {
         throw new IllegalStateException();
      }

      return element;
   }
}
