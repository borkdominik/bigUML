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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.operation;

import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.OperationOwner;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.DeleteSemanticChildCommand;

public class RemoveOperationSemanticCommand extends DeleteSemanticChildCommand<OperationOwner, Operation> {

   public RemoveOperationSemanticCommand(final ModelContext context,
      final OperationOwner parent,
      final Operation child) {
      super(context, parent, child);
   }

   @Override
   protected void deleteSemanticElement(final OperationOwner parent, final Operation child) {
      parent.getOwnedOperations().remove(child);
   }

}