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
package com.eclipsesource.uml.modelserver.commands.classdiagram.clazz;

public class AddClassShapeCommand { /*- {

   protected final GPoint shapePosition;
   protected String semanticProxyUri;
   protected Supplier<Class> classSupplier;

   private AddClassShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
      super(domain, modelUri);
      this.shapePosition = position;
      this.classSupplier = null;
      this.semanticProxyUri = null;
   }

   public AddClassShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
      final String semanticProxyUri) {
      this(domain, modelUri, position);
      this.semanticProxyUri = semanticProxyUri;
   }

   public AddClassShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
      final Supplier<Class> classSupplier) {
      this(domain, modelUri, position);
      this.classSupplier = classSupplier;
   }

   @Override
   protected void doExecute() {
      Shape newShape = UnotationFactory.eINSTANCE.createShape();
      newShape.setPosition(this.shapePosition);

      SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
      if (this.semanticProxyUri != null) {
         proxy.setUri(this.semanticProxyUri);
      } else {
         proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(classSupplier.get()));
      }
      newShape.setSemanticElement(proxy);

      umlDiagram.getElements().add(newShape);
   }
   */
}
