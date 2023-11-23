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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.core.commands;

import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Lifeline;

import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.BaseNotationElementCommand;

public class SDShiftShapeCommand extends BaseNotationElementCommand {
   protected final Shape shape;
   protected final GPoint target;
   protected final Element parent;

   public SDShiftShapeCommand(final ModelContext context,
      final Element parent, final GPoint targetPosition) {
      super(context);
      this.shape = notationElementAccessor.getElement(SemanticElementAccessor.getId(parent),
         Shape.class).get();
      this.target = targetPosition;
      this.parent = parent;
   }

   @Override
   protected void doExecute() {
      var verticalCorrection = 40;
      var offset = GraphUtil.point(0, target.getY() + verticalCorrection);
      shape.setPosition(GraphUtil.point(
         shape.getPosition().getX(),
         shape.getPosition().getY() + offset.getY()));
      shiftChildren(parent, offset);

   }

   protected void shiftChildren(final Element parent, final GPoint offset) {
      if (parent instanceof Lifeline) {
         ((Lifeline) parent).getCoveredBys()
            .stream()
            .filter(e -> {
               var notation = notationElementAccessor.getElement(SemanticElementAccessor.getId(e)).get();
               return notation instanceof Shape;
            })
            .map(e -> {
               return notationElementAccessor.getElement(SemanticElementAccessor.getId(e), Shape.class).get();
            })
            .forEach(shape -> {
               offsetChild(shape, offset);
            });
      }
   }

   protected void offsetChild(final Shape shape, final GPoint offset) {
      var childPosition = GraphUtil.copy(shape.getPosition());
      childPosition.setX(childPosition.getX() - offset.getX());
      childPosition.setY(childPosition.getY() - offset.getY());
      shape.setPosition(childPosition);
   }
}
