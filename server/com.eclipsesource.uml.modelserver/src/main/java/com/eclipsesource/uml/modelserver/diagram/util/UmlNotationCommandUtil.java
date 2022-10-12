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
package com.eclipsesource.uml.modelserver.diagram.util;

import java.awt.geom.Point2D;
import java.util.Optional;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.resource.Resource;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.notation.integration.NotationResource;
import org.eclipse.glsp.graph.GDimension;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.model.notation.Diagram;
import org.eclipse.glsp.server.emf.model.notation.NotationElement;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.PackageableElement;

import com.eclipsesource.uml.modelserver.unotation.UmlDiagram;

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

   public static Diagram getDiagram(final URI modelUri, final EditingDomain domain) {
      Resource notationResource = domain.getResourceSet()
         .getResource(modelUri.trimFileExtension().appendFileExtension(NotationResource.FILE_EXTENSION), false);
      EObject notationRoot = notationResource.getContents().get(0);
      if (!(notationRoot instanceof UmlDiagram)) {}
      return (Diagram) notationRoot;
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

   public static NotationElement getNotationElement(final URI modelUri, final EditingDomain domain,
      final String semanticUri) {
      Optional<NotationElement> notationElement = getDiagram(modelUri, domain).getElements().stream()
         .filter(el -> el.getSemanticElement().getElementId().equals(semanticUri)).findFirst();
      return notationElement.orElse(null);
   }

   @SuppressWarnings("unchecked")
   public static <C extends NotationElement> C getNotationElementUnchecked(final URI modelUri,
      final EditingDomain domain,
      final String semanticUri) {
      Optional<NotationElement> notationElement = getDiagram(modelUri, domain).getElements().stream()
         .filter(el -> el.getSemanticElement().getElementId().equals(semanticUri)).findFirst();
      return (C) notationElement.orElse(null);
   }

   public static <C extends NotationElement> C getNotationElement(final URI modelUri, final EditingDomain domain,
      final String semanticUri, final Class<C> clazz) {
      NotationElement element = getNotationElement(modelUri, domain, semanticUri);
      return clazz.cast(element);
   }

}
