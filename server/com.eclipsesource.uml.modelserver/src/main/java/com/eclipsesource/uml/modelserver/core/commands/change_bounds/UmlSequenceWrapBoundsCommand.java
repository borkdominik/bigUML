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

import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.glsp.server.types.ElementAndBounds;
import org.eclipse.uml2.uml.BehaviorExecutionSpecification;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.ExecutionSpecification;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.Message;
import org.eclipse.uml2.uml.MessageKind;
import org.eclipse.uml2.uml.OccurrenceSpecification;

import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public class UmlSequenceWrapBoundsCommand extends UmlWrapBoundsCommand {
   protected final List<ElementAndBounds> bounds;

   public UmlSequenceWrapBoundsCommand(final ModelContext context,
      final List<ElementAndBounds> bounds) {
      super(context, bounds);
      this.bounds = bounds;
   }

   @Override
   protected void doExecute() {

      bounds.forEach(bound -> {
         semanticElementAccessor.getElement(bound.getElementId(), Element.class).ifPresentOrElse(element -> {
            if (element instanceof BehaviorExecutionSpecification) {
               wrapAlternativeParent(((BehaviorExecutionSpecification) element).getStart().getCovered(), bound,
                  false);
            } else if (element instanceof OccurrenceSpecification
               && (((OccurrenceSpecification) element).getCovered() != null)) {
               wrapAlternativeParent(((OccurrenceSpecification) element).getCovered(), bound,
                  false);
            } else {
               wrapParent(element, bound);
            }
         },
            // not UML Elements
            () -> {
               // Message Anchors:
               if (bound.getElementId().endsWith("_MessageAnchor")) {
                  semanticElementAccessor.getElement(bound.getElementId().split("_MessageAnchor")[0], Element.class)
                     .ifPresent(
                        message -> {
                           wrapAlternativeParent(semanticElementAccessor.getParent(message, Element.class).get(),
                              bound,
                              true);
                        });
               }
            });
      });
   }

   /**
    * Wraps the provided parent element based on the position by using the position of the element that caused the
    * change
    * This method also repositions the children of the parent
    *
    *
    * @param parent       The parent which position should be changed
    * @param bound        Boundings of the element causing the wrapping
    * @param wrapPosition If the position of the element should be wrapped
    */
   protected void wrapAlternativeParent(final Element parent, final ElementAndBounds bound,
      final boolean wrapPosition) {

      var position = notationElementAccessor.getElement(bound.getElementId(), Shape.class).get().getPosition();
      if (wrapPosition) {
         wrapPosition(parent, position);
      }
      wrapSize(parent, position, bound.getNewSize());

      var parentId = SemanticElementAccessor.getId(parent);
      var parentShape = notationElementAccessor.getElement(parentId, Shape.class).get();
      var parentBounds = new ElementAndBounds();
      parentBounds.setElementId(parentId);
      parentBounds.setNewPosition(parentShape.getPosition());
      parentBounds.setNewSize(parentShape.getSize());
      wrapParent(parent, parentBounds);
   }

   /**
    * Wraps the parent based on the position by using the position of the element that caused the change
    * This method also repositions the children of the parent
    *
    * @param parent   The parent which position should be changed
    * @param position Position of the element that caused the wrapping
    */
   @Override
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
            .filter(e -> !(e instanceof OccurrenceSpecification || e instanceof ExecutionSpecification))
            .filter(e -> {
               var notation = notationElementAccessor.getElement(SemanticElementAccessor.getId(e)).get();
               return notation instanceof Shape;
            })
            .map(e -> {
               return notationElementAccessor.getElement(SemanticElementAccessor.getId(e), Shape.class).get();
            })
            .forEach(shape -> {
               alignChild(shape, position);
            });

         parent
            .allOwnedElements()
            .stream()
            .filter(e -> e instanceof Message)
            .filter(msg -> ((Message) msg).getMessageKind() == MessageKind.FOUND_LITERAL
               || ((Message) msg).getMessageKind() == MessageKind.LOST_LITERAL)
            .map(msg -> SemanticElementAccessor.getId(msg) + "_MessageAnchor")
            .map(ma -> {
               return notationElementAccessor.getElement(ma, Shape.class).get();
            })
            .forEach(edge -> {
               alignChild(edge, position);
            });
      }
   }

   protected boolean isLifeline(final ElementAndBounds bound) {
      return !semanticElementAccessor.getElement(bound.getElementId(), Element.class)
         .filter(element -> element instanceof Lifeline).isEmpty();
   }
}
