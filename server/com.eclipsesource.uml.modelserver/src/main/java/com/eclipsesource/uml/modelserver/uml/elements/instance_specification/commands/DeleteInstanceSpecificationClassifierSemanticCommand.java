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
package com.eclipsesource.uml.modelserver.uml.elements.instance_specification.commands;

import org.eclipse.uml2.uml.Classifier;
import org.eclipse.uml2.uml.InstanceSpecification;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public class DeleteInstanceSpecificationClassifierSemanticCommand
   extends BaseDeleteSemanticChildCommand<InstanceSpecification, Classifier> {

   public DeleteInstanceSpecificationClassifierSemanticCommand(final ModelContext context,
      final InstanceSpecification parent,
      final Classifier child) {
      super(context, parent, child);
   }

   @Override
   protected void deleteSemanticElement(final InstanceSpecification parent, final Classifier child) {
      parent.getClassifiers().remove(child);
   }

}
