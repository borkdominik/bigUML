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

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.ActivityPartition;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.UMLFactory;

public class AddPartitionCommand extends UmlSemanticElementCommand {

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

      /*if (parentContainer instanceof Activity) {
         String name = "NewPartition" + ((Activity) parentContainer).getPartitions().size();
         System.out.println("NAME: " + name);
         //newPartition = ((Activity) parentContainer).createPartition(name);
         ((Activity) parentContainer).createPartition(name);
      }*/
      if (parentContainer instanceof Activity) {
         Activity activity = (Activity) parentContainer;
         String name = "NewPartition" + activity.getPartitions().size();
         newPartition = activity.createPartition(name);
      } else if (parentContainer instanceof ActivityPartition) {
         ActivityPartition parent = (ActivityPartition) parentContainer;
         String name = "NewPartition" + parent.getSubpartitions().size();
         newPartition = parent.createSubpartition(name);
      } else {
         throw new RuntimeException("Invalid partition container type: " + parentContainer.getClass().getSimpleName());
      }
   }

   public ActivityPartition getNewPartition() {
      return newPartition;
   }

}
