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

   public UmlWrapBoundsCommand(final ModelContext context,
      final List<ElementAndBounds> bounds) {
      super(context);
      this.bounds = bounds;
   }

   @Override
   protected void doExecute() {
      bounds.forEach(bound -> {
         var element = semanticElementAccessor.getElement(bound.getElementId(), Element.class).get();
         wrapParent(element, bound);
      });
   }

   protected void wrapParent(final Element element, final ElementAndBounds bound) {
      var parent = semanticElementAccessor.getParent(element, Element.class);

      parent.ifPresent(p -> {
         var position = notationElementAccessor.getElement(bound.getElementId(), Shape.class).get().getPosition();
         wrapPosition(p, position);
         wrapSize(p, position, bound.getNewSize());

         var parentId = SemanticElementAccessor.getId(p);
         var parentShape = notationElementAccessor.getElement(parentId, Shape.class).get();
         var parentBounds = new ElementAndBounds();
         parentBounds.setElementId(parentId);
         parentBounds.setNewPosition(parentShape.getPosition());
         parentBounds.setNewSize(parentShape.getSize());
         wrapParent(p, parentBounds);
      });
   }

   /**
    * Wraps the parent based on the position by using the position of the element that caused the change
    * This method also repositions the children of the parent
    *
    * @param parent   The parent which position should be changed
    * @param position Position of the element that caused the wrapping
    */
   protected void wrapPosition(final Element parent, final GPoint position) {
      if (position.getX() < 0 || position.getY() < 0) {
         notationElementAccessor
            .getElement(SemanticElementAccessor.getId(parent), Shape.class)
            .ifPresent(shape -> {
               shiftContainer(shape, position);
            });

         parent
            .getOwnedElements()
            .stream()
            .filter(e -> {
               var notation = notationElementAccessor.getElement(SemanticElementAccessor.getId(e));
               if (notation.isEmpty()) {
                  return false;
               }
               return notation.get() instanceof Shape;
            })
            .map(e -> {
               return notationElementAccessor.getElement(SemanticElementAccessor.getId(e), Shape.class).get();
            })
            .forEach(shape -> {
               alignChild(shape, position);
            });
      }
   }

   /**
    * The parent calls this method with its own shape to include an out of bound child element
    *
    * The calculation only changes the dimension if a child is outside of the dimensions of the parent
    *
    * @param parent   The parent which size should be changed
    * @param position Position of the element that caused the wrapping
    * @param size     Size of the element that caused the wrapping
    */
   protected void wrapSize(final Element parent, final GPoint position, final GDimension size) {
      var containerShape = notationElementAccessor.getElement(SemanticElementAccessor.getId(parent),
         Shape.class).get();
      var containerSize = GraphUtil.copy(containerShape.getSize());

      var width = Math.max(containerSize.getWidth(), position.getX() + size.getWidth());
      var height = Math.max(containerSize.getHeight(), position.getY() + size.getHeight());

      containerSize.setWidth(width);
      containerSize.setHeight(height);
      containerShape.setSize(containerSize);
   }

   /**
    * The parent calls this method with its own shape to shift itself to the new coordinates
    * while respecting the current dimension
    *
    * The calculation only changes the positions or dimension if a child has a negative x or y value
    *
    * @param shape    Shape of the parent
    * @param position Position of the element that caused the wrapping
    */
   protected void shiftContainer(final Shape shape, final GPoint position) {
      var containerPosition = GraphUtil.copy(shape.getPosition());
      var containerSize = GraphUtil.copy(shape.getSize());

      var x = Math.min(0, position.getX());
      var y = Math.min(0, position.getY());

      var oldX = containerPosition.getX();
      var oldY = containerPosition.getY();

      containerPosition.setX(containerPosition.getX() + x);
      containerPosition.setY(containerPosition.getY() + y);
      shape.setPosition(containerPosition);

      containerSize.setWidth(containerSize.getWidth() + (oldX - containerPosition.getX()));
      containerSize.setHeight(containerSize.getHeight() + (oldY - containerPosition.getY()));
      shape.setSize(containerSize);
   }

   /**
    * The parent calls this method to align the children
    *
    * @param shape    Shape of a child
    * @param position Position of the element that caused the wrapping
    */
   protected void alignChild(final Shape shape, final GPoint position) {
      var childPosition = GraphUtil.copy(shape.getPosition());

      var x = Math.min(0, position.getX());
      var y = Math.min(0, position.getY());

      childPosition.setX(childPosition.getX() - x);
      childPosition.setY(childPosition.getY() - y);
      shape.setPosition(childPosition);
   }
}
