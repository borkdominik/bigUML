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
package com.eclipsesource.uml.modelserver.diagram.commons.notation;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GDimension;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.PackageableElement;

import com.eclipsesource.uml.modelserver.diagram.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.diagram.util.UmlSemanticCommandUtil;

import org.eclipse.glsp.server.emf.model.notation.Shape;

public class ChangeBoundsImprovedCommand extends UmlNotationElementCommand {
   protected final GPoint shapePosition;
   protected final GDimension shapeSize;
   protected final Shape shape;
   protected final PackageableElement container;

   public ChangeBoundsImprovedCommand(final EditingDomain domain, final URI modelUri,
      final String semanticProxyUri, final GPoint shapePosition, final GDimension shapeSize) {
      super(domain, modelUri);
      this.shapePosition = shapePosition;
      this.shapeSize = shapeSize;
      this.shape = UmlNotationCommandUtil.getNotationElement(modelUri, domain, semanticProxyUri, Shape.class);
      this.container = UmlSemanticCommandUtil.getParent(umlModel, semanticProxyUri, PackageableElement.class);
   }

   @Override
   protected void doExecute() {
      if (this.container != null && (shapePosition.getX() < 0 || shapePosition.getY() < 0)) {

         shiftContainer(this.container, shapePosition);
         this.container.getOwnedElements().forEach(element -> {
            alignElement(element, shapePosition);
         });

         shapePosition.setX(Math.max(0, shapePosition.getX()));
         shapePosition.setY(Math.max(0, shapePosition.getY()));
      }

      if (this.container != null) {
         resizeContainer(this.container, shapePosition, shapeSize);
      }

      shape.setPosition(shapePosition);
      shape.setSize(shapeSize);
   }

   private void resizeContainer(final PackageableElement container, final GPoint position, final GDimension size) {
      var containerShape = UmlNotationCommandUtil.getNotationElement(modelUri, domain,
         UmlSemanticCommandUtil.getSemanticUriFragment(container), Shape.class);
      var containerSize = containerShape.getSize();

      var width = Math.max(containerSize.getWidth(), position.getX() + size.getWidth());
      var height = Math.max(containerSize.getHeight(), position.getY() + size.getHeight());

      containerSize.setWidth(width);
      containerSize.setHeight(height);
      containerShape.setSize(containerSize);

   }

   private void shiftContainer(final PackageableElement container, final GPoint position) {
      var containerShape = UmlNotationCommandUtil.getNotationElement(modelUri, domain,
         UmlSemanticCommandUtil.getSemanticUriFragment(container), Shape.class);
      var containerPosition = containerShape.getPosition();
      var containerSize = containerShape.getSize();

      var x = Math.min(0, position.getX());
      var y = Math.min(0, position.getY());

      var oldX = containerPosition.getX();
      var oldY = containerPosition.getY();
      containerPosition.setX(containerPosition.getX() + x);
      containerPosition.setY(containerPosition.getY() + y);

      containerShape.setPosition(containerPosition);

      containerSize.setWidth(containerSize.getWidth() + (oldX - containerPosition.getX()));
      containerSize.setHeight(containerSize.getHeight() + (oldY - containerPosition.getY()));
      containerShape.setSize(containerSize);
   }

   private void alignElement(final Element element, final GPoint position) {
      var elementNotation = UmlNotationCommandUtil.getNotationElement(modelUri, domain,
         UmlSemanticCommandUtil.getSemanticUriFragment(element));

      if (elementNotation instanceof Shape) {
         var elementShape = (Shape) elementNotation;
         var elementPosition = elementShape.getPosition();

         var x = Math.min(0, position.getX());
         var y = Math.min(0, position.getY());

         elementPosition.setX(elementPosition.getX() - x);
         elementPosition.setY(elementPosition.getY() - y);
         elementShape.setPosition(elementPosition);
      }

   }
}
