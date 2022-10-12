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
package com.eclipsesource.uml.modelserver.old.diagram.common.notation;

import java.util.function.Supplier;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;

import org.eclipse.glsp.server.emf.model.notation.NotationFactory;
import org.eclipse.glsp.server.emf.model.notation.Shape;

import com.eclipsesource.uml.modelserver.diagram.base.notation.UmlNotationCommand;

public class AddGenericShapeCommand extends UmlNotationCommand {

   protected final GPoint shapePosition;
   protected String semanticProxyUri;
   protected Supplier<? extends EObject> elementSupplier;

   private AddGenericShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
      super(domain, modelUri);
      this.shapePosition = position;
      this.elementSupplier = null;
      this.semanticProxyUri = null;
   }

   public AddGenericShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
      final String semanticProxyUri) {
      this(domain, modelUri, position);
      this.semanticProxyUri = semanticProxyUri;
   }

   public AddGenericShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
      final Supplier<? extends EObject> elementSupplier) {
      this(domain, modelUri, position);
      this.elementSupplier = elementSupplier;
   }

   @Override
   protected void doExecute() {
      Shape newShape = NotationFactory.eINSTANCE.createShape();
      newShape.setPosition(this.shapePosition);

      var proxy = NotationFactory.eINSTANCE.createSemanticElementReference();
      if (this.semanticProxyUri != null) {
         proxy.setElementId(semanticProxyUri);
      } else {
         String uri = EcoreUtil.getURI(elementSupplier.get()).fragment();
         proxy.setElementId(uri);
      }
      newShape.setSemanticElement(proxy);

      umlDiagram.getElements().add(newShape);
   }

}
