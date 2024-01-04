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
package com.eclipsesource.uml.glsp.sdk.ui.properties;

import java.util.Map;
import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GDimension;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.model.notation.Shape;

import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;

public class GSizeProperty implements GNotationProperty {
   protected final GModelContext context;

   public GSizeProperty(final GModelContext context) {
      super();
      this.context = context;
   }

   @Override
   public void assign(final EObject source, final GModelElement element) {
      if (element instanceof GNode) {
         var node = (GNode) element;
         getNotationSize(source).ifPresent(size -> {
            if (size != null) {
               node.setSize(size);
               node.getLayoutOptions().putAll(Map.of(
                  GLayoutOptions.KEY_PREF_WIDTH, size.getWidth(),
                  GLayoutOptions.KEY_PREF_HEIGHT, size.getHeight()));
            }
         });
      } else {
         throw new IllegalStateException();
      }
   }

   protected Optional<GDimension> getNotationSize(final EObject source) {
      return context.modelState().getIndex().getNotation(source, Shape.class).map(shape -> shape.getSize())
         .map(size -> {
            return GraphUtil.copy(size);
         });
   }

}
