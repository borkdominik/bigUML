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
package com.eclipsesource.uml.modelserver.old.diagram.statemachinediagram.statemachine;

public class AddStateMachineShapeCommand { /*- {

   protected final GPoint shapePosition;
   protected String semanticProxyUri;
   protected Supplier<StateMachine> stateMachineSupplier;

   private AddStateMachineShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
      super(domain, modelUri);
      this.shapePosition = position;
      this.stateMachineSupplier = null;
      this.semanticProxyUri = null;
   }

   public AddStateMachineShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
      final String semanticProxyUri) {
      this(domain, modelUri, position);
      this.semanticProxyUri = semanticProxyUri;
   }

   public AddStateMachineShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
      final Supplier<StateMachine> classSupplier) {
      this(domain, modelUri, position);
      this.stateMachineSupplier = classSupplier;
   }

   @Override
   protected void doExecute() {
      Shape newShape = UnotationFactory.eINSTANCE.createShape();
      newShape.setPosition(this.shapePosition);

      SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
      if (this.semanticProxyUri != null) {
         proxy.setUri(this.semanticProxyUri);
      } else {
         proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(stateMachineSupplier.get()));
      }
      newShape.setSemanticElement(proxy);

      umlDiagram.getElements().add(newShape);
   }
   */
}
