/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.gmodel;

import java.util.Map;
import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GDimension;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.builder.AbstractGNodeBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.model.notation.Shape;

public abstract class BaseGNodeMapper<TSource extends EObject, TTarget extends GNode>
   extends BaseGModelMapper<TSource, TTarget> {

   @Deprecated
   protected <TBuilder extends AbstractGNodeBuilder<?, ?>> void applyShapeNotation(final TSource source,
      final TBuilder builder) {
      getNotationPosition(source).ifPresent(position -> {
         if (position != null) {
            builder.position(position);
         }
      });

      applyShapeSize(source, builder);
   }

   @Deprecated
   protected <TBuilder extends AbstractGNodeBuilder<?, ?>> void applyShapeSize(final TSource source,
      final TBuilder builder) {
      getNotationSize(source).ifPresent(size -> {
         if (size != null) {
            builder.size(size);
            builder.addLayoutOptions(Map.of(
               GLayoutOptions.KEY_PREF_WIDTH, size.getWidth(),
               GLayoutOptions.KEY_PREF_HEIGHT, size.getHeight()));
         }
      });
   }

   @Deprecated
   protected Optional<Shape> getNotation(final TSource source) {
      return modelState.getIndex().getNotation(source, Shape.class);
   }

   @Deprecated
   protected Optional<GPoint> getNotationPosition(final TSource source) {
      return getNotation(source).map(shape -> shape.getPosition()).map(position -> {
         return GraphUtil.copy(position);
      });
   }

   @Deprecated
   protected Optional<GDimension> getNotationSize(final TSource source) {
      return getNotation(source).map(shape -> shape.getSize()).map(size -> {
         return GraphUtil.copy(size);
      });
   }
}
