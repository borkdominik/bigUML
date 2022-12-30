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
package com.eclipsesource.uml.modelserver.core.commands.change_bounds;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GDimension;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.glsp.server.types.ElementAndBounds;
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.BaseNotationElementCommand;

public class UmlWrapBoundsCommand extends BaseNotationElementCommand {
   protected final List<ElementAndBounds> bounds;
   protected final Map<String, GPoint> elementPositions;

   public UmlWrapBoundsCommand(final ModelContext context,
      final List<ElementAndBounds> bounds) {
      super(context);
      this.bounds = bounds;
      this.elementPositions = bounds.stream()
         .collect(Collectors.toMap(b -> b.getElementId(), b -> GraphUtil.copy(b.getNewPosition())));
   }

   @Override
   protected void doExecute() {

      bounds.forEach(bound -> {
         var element = semanticElementAccessor.getElement(bound.getElementId(), Element.class);
         element.ifPresent(e -> {
            var parent = semanticElementAccessor.getParent(e, Element.class);

            parent.ifPresent(p -> {
               var position = this.elementPositions.get(bound.getElementId());
               wrapPositionBound(p, position);
               wrapSizeBound(p, position, bound.getNewSize());
               recalculateElementPositions(bound);
            });
         });

      });
   }

   protected void recalculateElementPositions(final ElementAndBounds bound) {
      this.elementPositions.forEach((elementId, position) -> {
         if (!elementId.equals(bound.getElementId())) {
            position.setX(position.getX() - Math.min(0, bound.getNewPosition().getX()));
            position.setY(position.getY() - Math.min(0, bound.getNewPosition().getY()));
         }
      });
   }

   protected void wrapPositionBound(final Element parent, final GPoint position) {
      var containerShape = notationElementAccessor.getElement(SemanticElementAccessor.getId(parent),
         Shape.class).get();
      var childElements = parent.getOwnedElements();

      if (position.getX() < 0 || position.getY() < 0) {
         shiftContainer(containerShape, position);
         childElements.forEach(element -> {
            alignChild(element, position);
         });
      }
   }

   protected void wrapSizeBound(final Element parent, final GPoint position, final GDimension size) {
      var containerShape = notationElementAccessor.getElement(SemanticElementAccessor.getId(parent),
         Shape.class).get();
      var containerSize = containerShape.getSize();

      var width = Math.max(containerSize.getWidth(), position.getX() + size.getWidth());
      var height = Math.max(containerSize.getHeight(), position.getY() + size.getHeight());

      containerSize.setWidth(width);
      containerSize.setHeight(height);

      containerShape.setSize(containerSize);
   }

   protected void shiftContainer(final Shape containerShape, final GPoint position) {
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

   protected void alignChild(final Element element, final GPoint position) {
      var elementShape = notationElementAccessor.getElement(SemanticElementAccessor.getId(element), Shape.class).get();
      var elementPosition = elementShape.getPosition();

      var x = Math.min(0, position.getX());
      var y = Math.min(0, position.getY());

      elementPosition.setX(elementPosition.getX() - x);
      elementPosition.setY(elementPosition.getY() - y);
      elementShape.setPosition(elementPosition);
   }
}
