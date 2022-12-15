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

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.OperationOwner;

import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;

public class RemoveOperationSemanticCommand extends UmlSemanticElementCommand {

   protected final OperationOwner parent;
   protected final Operation operation;

   public RemoveOperationSemanticCommand(final EditingDomain domain, final URI modelUri,
      final OperationOwner parent,
      final Operation operation) {
      super(domain, modelUri);
      this.parent = parent;
      this.operation = operation;
   }

   @Override
   protected void doExecute() {
      parent.getOwnedOperations().remove(operation);
   }

}
