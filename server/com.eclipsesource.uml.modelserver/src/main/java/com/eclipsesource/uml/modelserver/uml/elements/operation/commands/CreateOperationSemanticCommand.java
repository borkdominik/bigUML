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
package com.eclipsesource.uml.modelserver.uml.elements.operation.commands;

import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.OperationOwner;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public final class CreateOperationSemanticCommand extends BaseCreateSemanticChildCommand<OperationOwner, Operation> {

   public CreateOperationSemanticCommand(final ModelContext context,
      final OperationOwner parent) {
      super(context, parent);
   }

   @Override
   protected Operation createSemanticElement(final OperationOwner parent) {
      var nameGenerator = new ListNameGenerator(Operation.class, parent.getOwnedOperations());

      return parent.createOwnedOperation(nameGenerator.newName(), null, null);
   }

}
