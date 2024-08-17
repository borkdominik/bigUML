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
package com.borkdominik.big.glsp.uml.uml.elements.activity_node;

import java.util.Set;

import org.eclipse.emf.common.util.Enumerator;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.ActivityNode;
import org.eclipse.uml2.uml.ActivityPartition;
import org.eclipse.uml2.uml.UMLPackage;

import com.borkdominik.big.glsp.server.core.commands.semantic.BGCreateNodeSemanticCommand;
import com.borkdominik.big.glsp.server.core.model.BGTypeProvider;
import com.borkdominik.big.glsp.server.elements.handler.operations.integrations.BGEMFNodeOperationHandler;
import com.borkdominik.big.glsp.uml.uml.UMLTypes;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateNodeCommand;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ActivityNodeOperationHandler extends BGEMFNodeOperationHandler<ActivityNode, EObject> {

   @Inject
   public ActivityNodeOperationHandler(@Assisted final Enumerator representation,
      @Assisted final Set<BGTypeProvider> elementTypes) {
      super(representation, elementTypes);

   }

   @Override
   protected BGCreateNodeSemanticCommand<ActivityNode, EObject, ?> createSemanticCommand(
      final CreateNodeOperation operation,
      final EObject parent) {
      var argument = UMLCreateNodeCommand.Argument
         .<ActivityNode, EObject> createChildArgumentBuilder()
         .supplier((par) -> {
            if (par instanceof Activity p) {
               return createNode(operation, p);
            } else if (par instanceof ActivityPartition p) {

               var node = createNode(operation, p.containingActivity());
               node.getInPartitions().add(p);

               return node;
            }
            return null;
         })
         .build();

      return new UMLCreateNodeCommand<>(commandContext, parent, argument);
   }

   protected ActivityNode createNode(final CreateNodeOperation operation, final Activity parent) {
      // Actions
      if (operation.getElementTypeId().equals(UMLTypes.OPAQUE_ACTION.prefix(representation))) {
         return parent.createOwnedNode(null, UMLPackage.Literals.OPAQUE_ACTION);
      } else if (operation.getElementTypeId().equals(UMLTypes.ACCEPT_EVENT_ACTION.prefix(representation))) {
         return parent.createOwnedNode(null, UMLPackage.Literals.ACCEPT_EVENT_ACTION);
      } else if (operation.getElementTypeId().equals(UMLTypes.SEND_SIGNAL_ACTION.prefix(representation))) {
         return parent.createOwnedNode(null, UMLPackage.Literals.SEND_SIGNAL_ACTION);
         // Control Nodes
      } else if (operation.getElementTypeId().equals(UMLTypes.ACTIVITY_FINAL_NODE.prefix(representation))) {
         return parent.createOwnedNode(null, UMLPackage.Literals.ACTIVITY_FINAL_NODE);
      } else if (operation.getElementTypeId().equals(UMLTypes.DECISION_NODE.prefix(representation))) {
         return parent.createOwnedNode(null, UMLPackage.Literals.DECISION_NODE);
      } else if (operation.getElementTypeId().equals(UMLTypes.FLOW_FINAL_NODE.prefix(representation))) {
         return parent.createOwnedNode(null, UMLPackage.Literals.FLOW_FINAL_NODE);
      } else if (operation.getElementTypeId().equals(UMLTypes.FORK_NODE.prefix(representation))) {
         return parent.createOwnedNode(null, UMLPackage.Literals.FORK_NODE);
      } else if (operation.getElementTypeId().equals(UMLTypes.INITIAL_NODE.prefix(representation))) {
         return parent.createOwnedNode(null, UMLPackage.Literals.INITIAL_NODE);
      } else if (operation.getElementTypeId().equals(UMLTypes.JOIN_NODE.prefix(representation))) {
         return parent.createOwnedNode(null, UMLPackage.Literals.JOIN_NODE);
      } else if (operation.getElementTypeId().equals(UMLTypes.MERGE_NODE.prefix(representation))) {
         return parent.createOwnedNode(null, UMLPackage.Literals.MERGE_NODE);
         // Object Nodes
      } else if (operation.getElementTypeId().equals(UMLTypes.ACTIVITY_PARAMETER_NODE.prefix(representation))) {
         return parent.createOwnedNode(null, UMLPackage.Literals.ACTIVITY_PARAMETER_NODE);
      } else if (operation.getElementTypeId().equals(UMLTypes.CENTRAL_BUFFER_NODE.prefix(representation))) {
         return parent.createOwnedNode(null, UMLPackage.Literals.CENTRAL_BUFFER_NODE);
      } else {
         throw new IllegalStateException("Provided typeId " + operation.getElementTypeId() + " is not supported.");
      }
   }

}
