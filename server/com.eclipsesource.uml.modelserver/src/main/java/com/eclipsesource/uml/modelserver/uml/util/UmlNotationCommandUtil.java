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
package com.eclipsesource.uml.modelserver.uml.util;

import java.awt.geom.Point2D;

import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.glsp.graph.GDimension;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.PackageableElement;

public final class UmlNotationCommandUtil {

   private UmlNotationCommandUtil() {}

   public static GPoint getGPoint(final Point2D.Double position) {
      return GraphUtil.point(position.x, position.y);
   }

   public static GPoint getGPoint(final String propertyX, final String propertyY) {
      GPoint gPoint = GraphUtil.point(
         propertyX.isEmpty() ? 0.0d : Double.parseDouble(propertyX),
         propertyY.isEmpty() ? 0.0d : Double.parseDouble(propertyY));
      return gPoint;
   }

   public static GDimension getGDimension(final String height, final String width) {
      GDimension gDimension = GraphUtil.dimension(
         height.isEmpty() ? 0.0d : Double.parseDouble(height),
         width.isEmpty() ? 0.0d : Double.parseDouble(width));
      return gDimension;
   }

   public static String getSemanticProxyUri(final PackageableElement element) {
      return EcoreUtil.getURI(element).fragment();
   }

   public static String getSemanticProxyUri(final Element element) {
      return EcoreUtil.getURI(element).fragment();
   }

   public static String getSemanticProxyUriElement(final Element element) {
      return EcoreUtil.getURI(element).fragment();
   }

}
