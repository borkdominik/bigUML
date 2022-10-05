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
package com.eclipsesource.uml.modelserver.commands.activitydiagram.partition;

public class AddPartitionCommand { /*-

   protected ActivityPartition newPartition;
   protected final String parentSemanticUriFragment;

   public AddPartitionCommand(final EditingDomain domain, final URI modelUri, final String parentUri) {
      super(domain, modelUri);
      //container = UmlSemanticCommandUtil.getElement(umlModel, parentUri, Element.class);
      this.newPartition = UMLFactory.eINSTANCE.createActivityPartition();
      this.parentSemanticUriFragment = parentUri;

   }

   @Override
   protected void doExecute() {
      newPartition.setName(UmlSemanticCommandUtil.getNewPartitionName(umlModel));
      NamedElement parentContainer = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, NamedElement.class);
      System.out.println("PARENT " + parentContainer.getName());

      /*if (parentContainer instanceof Activity) {
         String name = "NewPartition" + ((Activity) parentContainer).getPartitions().size();
         System.out.println("NAME: " + name);
         //newPartition = ((Activity) parentContainer).createPartition(name);
         ((Activity) parentContainer).createPartition(name);
      }*
   if(parentContainer instanceof Activity)
   {
      Activity activity = (Activity) parentContainer;
      String name = "NewPartition" + activity.getPartitions().size();
      newPartition = activity.createPartition(name);
   }else if(parentContainer instanceof ActivityPartition)
   {
      System.out.println("MS IN PARTITION!!!");
      ActivityPartition parent = (ActivityPartition) parentContainer;
      String name = "NewPartition" + parent.getSubpartitions().size();
      newPartition = parent.createSubpartition(name);
   }else
   {
      throw new RuntimeException("Invalid partition container type: " + parentContainer.getClass().getSimpleName());
   }
   }

   public ActivityPartition getNewPartition() {
      return newPartition;
   }
   */
}
