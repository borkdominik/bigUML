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
package com.eclipsesource.uml.modelserver.old.diagram.activitydiagram.datanode;

public class AddObjectNodeCommand { /*-implements Supplier<ObjectNode> {

   protected final ObjectNode node;
   protected final Element parent;

   public AddObjectNodeCommand(final EditingDomain domain, final URI modelUri, final String parentUri,
      final String className) {
      super(domain, modelUri);

      try {
         Class<? extends ObjectNode> clazz;
         clazz = Class.forName(className).asSubclass(ObjectNode.class);
         if (CentralBufferNode.class.equals(clazz)) {
            node = UMLFactory.eINSTANCE.createCentralBufferNode();
         } else if (DataStoreNode.class.equals(clazz)) {
            node = UMLFactory.eINSTANCE.createDataStoreNode();
         } else {
            throw new RuntimeException("Invalid ObjectNode class: " + className);
         }
         parent = UmlSemanticCommandUtil.getElement(umlModel, parentUri, Element.class);
      } catch (ClassNotFoundException e) {
         throw new RuntimeException(e);
      }
   }

   @Override
   protected void doExecute() {

      Activity activity = null;
      if (parent instanceof Activity) {
         activity = (Activity) parent;
         if (node instanceof DataStoreNode) {
            node.setName(
               "NewDatastore" + activity.getOwnedNodes().stream().filter(DataStoreNode.class::isInstance).count());
         } else if (node instanceof CentralBufferNode) {
            node.setName("NewCentralBuffer"
               + activity.getOwnedNodes().stream().filter(CentralBufferNode.class::isInstance).count());
         }

      } else if (parent instanceof ActivityPartition) {
         // Should not be possible ???
         ActivityPartition partition = ((ActivityPartition) parent);
         activity = partition.containingActivity();
         partition.getNodes().add(node);
      } else {
         throw new RuntimeException("Invalid action conatainer type: " + parent.getClass().getSimpleName());
      }

      activity.getOwnedNodes().add(node);
   }

   @Override
   public ObjectNode get() {
      return node;
   }
   */
}
