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
package com.eclipsesource.uml.modelserver.old.diagram.activitydiagram.controlnode;

public class AddControlNodeCommand { /*-

   protected final ControlNode node;
   protected final Element parent;
   protected final String parentSemanticUri;

   public AddControlNodeCommand(final EditingDomain domain, final URI modelUri, final String parentUri,
                                final String className) {
      super(domain, modelUri);
      this.parentSemanticUri = parentUri;
      try {
         Class<? extends ControlNode> clazz;
         clazz = Class.forName(className).asSubclass(ControlNode.class);
         if (InitialNode.class.equals(clazz)) {
            node = UMLFactory.eINSTANCE.createInitialNode();
         } else if (FinalNode.class.equals(clazz)) {
            node = UMLFactory.eINSTANCE.createActivityFinalNode();
         } else if (FlowFinalNode.class.equals(clazz)) {
            node = UMLFactory.eINSTANCE.createFlowFinalNode();
         } else if (DecisionNode.class.equals(clazz)) {
            node = UMLFactory.eINSTANCE.createDecisionNode();
         } else if (MergeNode.class.equals(clazz)) {
            node = UMLFactory.eINSTANCE.createMergeNode();
         } else if (ForkNode.class.equals(clazz)) {
            node = UMLFactory.eINSTANCE.createForkNode();
         } else if (JoinNode.class.equals(clazz)) {
            node = UMLFactory.eINSTANCE.createJoinNode();
         } else {
            throw new RuntimeException("Invalid ControlNode class: " + className);
         }
         parent = UmlSemanticCommandUtil.getElement(umlModel, parentUri, Element.class);
      } catch (ClassNotFoundException e) {
         throw new RuntimeException(e);
      }
   }

   @Override
   protected void doExecute() {
      NamedElement parentContainer = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUri, NamedElement.class);

      if (parentContainer instanceof InterruptibleActivityRegion) {
         ((InterruptibleActivityRegion) parentContainer).getNodes().add(node);
      } else if (parentContainer instanceof ActivityPartition) {
         ((ActivityPartition) parentContainer).getNodes().add(node);
      } else if (parentContainer instanceof Activity) {
         ((Activity) parentContainer).getNodes().add(node);
      }

      /*Activity activity = null;
      System.out.println("PARENT " + parent.getClass());
      if (parent instanceof ActivityPartition) {
         ActivityPartition partition = ((ActivityPartition) parent);
         activity = partition.containingActivity();
         partition.getNodes().add(node);
      } else if (parent instanceof InterruptibleActivityRegion) {
         InterruptibleActivityRegion region = ((InterruptibleActivityRegion) parent);
         activity = region.containingActivity();
         region.getNodes().add(node);
      } else if (parent instanceof Activity) {
         activity = (Activity) parent;
      } else {
         throw new RuntimeException("Invalid action conatainer type: " + parent.getClass().getSimpleName());
      }

      activity.getOwnedNodes().add(node);*
   }

   public ControlNode getNewControlNode() { return node; }
   */
}
