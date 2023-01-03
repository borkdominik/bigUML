/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.shared.notation.commands;

import java.util.function.Supplier;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.emf.model.notation.NotationFactory;

import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.BaseNotationElementCommand;

public class AddEdgeNotationCommand extends BaseNotationElementCommand {

   protected Supplier<? extends EObject> semanticElementSupplier;

   public AddEdgeNotationCommand(final ModelContext context, final Supplier<? extends EObject> semanticElementSupplier) {
      super(context);
      this.semanticElementSupplier = semanticElementSupplier;
   }

   @Override
   protected void doExecute() {
      var newEdge = NotationFactory.eINSTANCE.createEdge();

      var semanticReference = NotationFactory.eINSTANCE.createSemanticElementReference();
      semanticReference.setElementId(SemanticElementAccessor.getId(semanticElementSupplier.get()));

      newEdge.setSemanticElement(semanticReference);

      diagram.getElements().add(newEdge);
   }

}
