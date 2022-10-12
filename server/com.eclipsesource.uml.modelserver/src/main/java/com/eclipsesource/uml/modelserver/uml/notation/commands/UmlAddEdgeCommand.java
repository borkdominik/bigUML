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
package com.eclipsesource.uml.modelserver.uml.notation.commands;

import java.util.function.Supplier;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.server.emf.model.notation.Edge;
import org.eclipse.glsp.server.emf.model.notation.NotationFactory;
import org.eclipse.glsp.server.emf.model.notation.SemanticElementReference;

import com.eclipsesource.uml.modelserver.uml.notation.UmlNotationElementCommand;

public class UmlAddEdgeCommand extends UmlNotationElementCommand {

   protected String semanticElementId;
   // object's ID attribute
   protected Supplier<? extends EObject> identifiableSupplier;

   private UmlAddEdgeCommand(final EditingDomain domain, final URI modelUri) {
      super(domain, modelUri);
      this.semanticElementId = null;
      this.identifiableSupplier = null;
   }

   public UmlAddEdgeCommand(final EditingDomain domain, final URI modelUri, final String semanticElementId) {
      this(domain, modelUri);
      this.semanticElementId = semanticElementId;
   }

   public UmlAddEdgeCommand(final EditingDomain domain, final URI modelUri,
      final Supplier<? extends EObject> supplier) {
      this(domain, modelUri);
      this.identifiableSupplier = supplier;
   }

   @Override
   protected void doExecute() {
      Edge newEdge = NotationFactory.eINSTANCE.createEdge();

      SemanticElementReference semanticReference = NotationFactory.eINSTANCE.createSemanticElementReference();
      if (this.semanticElementId != null) {
         semanticReference.setElementId(semanticElementId);
      } else {
         semanticReference.setElementId(EcoreUtil.getURI(identifiableSupplier.get()).fragment());
      }
      newEdge.setSemanticElement(semanticReference);

      diagram.getElements().add(newEdge);
   }

}
