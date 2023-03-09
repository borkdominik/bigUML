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
package com.eclipsesource.uml.modelserver.old.diagram.statemachinediagram.pseudostate;

public class AddPseudoStateShapeCommand { /*- {

   protected final GPoint shapePosition;
   protected String semanticProxyUri;
   protected Supplier<Pseudostate> pseudostateSupplier;

   private AddPseudoStateShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
      super(domain, modelUri);
      this.shapePosition = position;
      this.pseudostateSupplier = null;
      this.semanticProxyUri = null;
   }

   public AddPseudoStateShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
      final String semanticProxyUri) {
      this(domain, modelUri, position);
      this.semanticProxyUri = semanticProxyUri;
   }

   public AddPseudoStateShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
      final Supplier<Pseudostate> pseudostateSupplier) {
      this(domain, modelUri, position);
      this.pseudostateSupplier = pseudostateSupplier;
   }

   @Override
   protected void doExecute() {
      Shape newShape = UnotationFactory.eINSTANCE.createShape();
      newShape.setPosition(this.shapePosition);

      SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
      if (this.semanticProxyUri != null) {
         proxy.setUri(this.semanticProxyUri);
      } else {
         proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(pseudostateSupplier.get()));
      }
      newShape.setSemanticElement(proxy);

      umlDiagram.getElements().add(newShape);
   }
   */
}
