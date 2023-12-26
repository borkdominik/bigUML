/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.properties;

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.model.notation.Shape;

import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.GModelContext;

public class GPositionProperty implements GNotationProperty {
   protected final GModelContext context;

   public GPositionProperty(final GModelContext context) {
      super();
      this.context = context;
   }

   @Override
   public void assign(final EObject source, final GModelElement element) {
      if (element instanceof GNode) {
         var node = (GNode) element;
         getNotationPosition(source).ifPresent(position -> {
            if (position != null) {
               node.setPosition(position);
            }
         });
      } else {
         throw new IllegalStateException();
      }
   }

   protected Optional<GPoint> getNotationPosition(final EObject source) {
      return context.modelState().getIndex().getNotation(source, Shape.class).map(shape -> shape.getPosition())
         .map(position -> {
            return GraphUtil.copy(position);
         });
   }

}
