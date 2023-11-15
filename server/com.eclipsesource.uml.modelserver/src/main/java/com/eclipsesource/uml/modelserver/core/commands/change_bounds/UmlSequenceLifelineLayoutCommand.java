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

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.glsp.server.types.ElementAndBounds;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.MessageEnd;
import org.eclipse.uml2.uml.MessageSort;

import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public class UmlSequenceLifelineLayoutCommand extends UmlWrapBoundsCommand {
   protected final List<ElementAndBounds> bounds;
   protected final boolean autoLayout = true; // currently hardcoded but could be made configurable by user
   protected final double defaultY = 30;

   public UmlSequenceLifelineLayoutCommand(final ModelContext context,
      final List<ElementAndBounds> bounds) {
      super(context, bounds);
      this.bounds = bounds;
   }

   @Override
   protected void doExecute() {
      bounds.forEach(bound -> {
         if (isLifeline(bound)) {
            lifelineVerticalAlignmentHandler(context, bound);
         }
      });

      if (bounds.stream().anyMatch(b -> isLifeline(b))) {
         lifelineOverlapHandler(context, bounds);
      }
   }

   protected void lifelineVerticalAlignmentHandler(final ModelContext context, final ElementAndBounds bound) {
      Lifeline ll = semanticElementAccessor.getElement(bound.getElementId(), Lifeline.class).get();
      if (!isCreated(ll)) {
         Shape s = notationElementAccessor.getElement(bound.getElementId(), Shape.class).get();
         s.getPosition().setY(defaultY);
         bound.getNewPosition().setY(defaultY);
      }
   }

   protected void lifelineOverlapHandler(final ModelContext context, final List<ElementAndBounds> bounds) {
      double horizontalSpacing = 20;

      context.model.allOwnedElements().stream()
         .filter(e -> e instanceof Interaction).map(i -> (Interaction) i)
         .findFirst()
         .ifPresent(interaction -> {

            List<Shape> lifelineShapes = interaction.getLifelines().stream()
               .map(l -> notationElementAccessor.getElement(SemanticElementAccessor.getId(l))
                  .get())
               .map(t -> ((Shape) t))
               .sorted(Comparator.comparingDouble(value -> value.getPosition().getX()))
               .collect(Collectors.toList());

            Shape lastShape = null;
            for (Shape s : lifelineShapes) {
               if (lastShape == null) {
                  if (autoLayout) {
                     s.getPosition().setX(horizontalSpacing * 2);
                  }
               } else {
                  double lastX = lastShape.getPosition().getX() + lastShape.getSize().getWidth();
                  if (autoLayout || s.getPosition().getX() < lastX) {
                     s.getPosition().setX(lastX + horizontalSpacing);
                  }
               }
               lastShape = s;
            }
         });
   }

   protected boolean isLifeline(final ElementAndBounds bound) {
      return !semanticElementAccessor.getElement(bound.getElementId(), Element.class)
         .filter(element -> element instanceof Lifeline).isEmpty();
   }

   protected boolean isCreated(final Lifeline lifeline) {
      return lifeline.getCoveredBys().stream()
         .anyMatch(f -> (f instanceof MessageEnd)
            && ((MessageEnd) f).getMessage().getMessageSort() == MessageSort.CREATE_MESSAGE_LITERAL
            && ((MessageEnd) f).getMessage().getReceiveEvent() == f);
   }

}
