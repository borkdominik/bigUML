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
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Operation;

import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.generator.OperatorNameGenerator;
import com.eclipsesource.uml.modelserver.uml.generator.ContextualNameGenerator;

public class AddOperationSemanticCommand extends UmlSemanticElementCommand {

   protected Operation newOperation;
   protected final Class parent;
   protected final ContextualNameGenerator<Class> nameGenerator;

   public AddOperationSemanticCommand(final EditingDomain domain, final URI modelUri,
      final Class parent) {
      super(domain, modelUri);
      this.parent = parent;
      this.nameGenerator = new OperatorNameGenerator();
   }

   @Override
   protected void doExecute() {
      newOperation = parent.createOwnedOperation(nameGenerator.newNameInContextOf(parent), null, null);
   }
}
