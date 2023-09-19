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
package com.eclipsesource.uml.modelserver.uml.elements.activity_partition.commands;

import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.ActivityPartition;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public class CreateActivityPartitionSemanticCommand
   extends BaseCreateSemanticChildCommand<Activity, ActivityPartition> {

   public CreateActivityPartitionSemanticCommand(final ModelContext context, final Activity parent) {
      super(context, parent);
   }

   @Override
   protected ActivityPartition createSemanticElement(final Activity parent) {
      var nameGenerator = new ListNameGenerator(ActivityPartition.class, parent.getPartitions());

      return parent.createPartition(nameGenerator.newName());
   }

}
