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
package com.eclipsesource.uml.modelserver.old.diagram.classdiagram.association;

public class AddAssociationEdgeCommand { /*- {

   protected String semanticProxyUri;
   protected Supplier<Association> associationSupplier;

   private AddAssociationEdgeCommand(final EditingDomain domain, final URI modelUri) {
      super(domain, modelUri);
      this.semanticProxyUri = null;
      this.associationSupplier = null;
   }

   public AddAssociationEdgeCommand(final EditingDomain domain, final URI modelUri, final String semanticProxyUri) {
      this(domain, modelUri);
      this.semanticProxyUri = semanticProxyUri;
   }

   public AddAssociationEdgeCommand(final EditingDomain domain, final URI modelUri,
      final Supplier<Association> associationSupplier) {
      this(domain, modelUri);
      this.associationSupplier = associationSupplier;
   }

   @Override
   protected void doExecute() {
      Edge newEdge = UnotationFactory.eINSTANCE.createEdge();

      SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
      if (this.semanticProxyUri != null) {
         proxy.setUri(this.semanticProxyUri);
      } else {
         proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(associationSupplier.get()));
      }
      newEdge.setSemanticElement(proxy);

      umlDiagram.getElements().add(newEdge);
   }
   */
}
