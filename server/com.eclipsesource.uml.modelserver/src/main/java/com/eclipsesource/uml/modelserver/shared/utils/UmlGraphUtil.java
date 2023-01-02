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
package com.eclipsesource.uml.modelserver.shared.utils;

import java.awt.geom.Point2D;

import org.eclipse.glsp.graph.GDimension;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;

public final class UmlGraphUtil {
   private UmlGraphUtil() {}

   public static GPoint parseGPoint(final Point2D.Double position) {
      return GraphUtil.point(position.x, position.y);
   }

   public static GPoint parseGPoint(final String x, final String y) {
      return GraphUtil.point(Double.parseDouble(x), Double.parseDouble(y));
   }

   public static GDimension parseGDimension(final String width, final String height) {
      return GraphUtil.dimension(Double.parseDouble(width), Double.parseDouble(height));
   }
}
