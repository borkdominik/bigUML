/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.utils;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;

import com.eclipsesource.uml.glsp.model.UmlModelState;

public final class UmlIDUtil {

   private UmlIDUtil() {}

   public static String LABEL_NAME_SUFFIX = "_label_name";
   public static String HEADER_SUFFIX = "_header";
   public static String OUTER_HEADER_SUFFIX = "_header_outer";
   public static String TYPE_HEADER_SUFFIX = "_header_type";
   public static String HEADER_ICON_SUFFIX = "_header_icon";
   public static String HEADER_LABEL_SUFFIX = "_header_label";
   public static String CHILD_COMPARTMENT_SUFFIX = "_childCompartment";

   public static String createChildCompartmentId(final String containerId) {
      return containerId + CHILD_COMPARTMENT_SUFFIX;
   }

   public static String getElementIdFromChildCompartment(final String childCompartmentId) {
      return childCompartmentId.replace(CHILD_COMPARTMENT_SUFFIX, "");
   }

   public static String createLabelNameId(final String containerId) {
      return containerId + LABEL_NAME_SUFFIX;
   }

   public static String getElementIdFromLabelName(final String labelNameId) {
      return labelNameId.replace(LABEL_NAME_SUFFIX, "");
   }

   public static String createHeaderId(final String containerId) {
      return containerId + HEADER_SUFFIX;
   }

   public static String getElementIdFromHeader(final String headerId) {
      return headerId.replace(HEADER_SUFFIX, "");
   }

   public static String createHeaderIconId(final String containerId) {
      return containerId + HEADER_ICON_SUFFIX;
   }

   public static String getElementIdFromHeaderIcon(final String headerIconId) {
      return headerIconId.replace(HEADER_ICON_SUFFIX, "");
   }

   public static String createOuterHeaderId(final String containerId) {
      return containerId + OUTER_HEADER_SUFFIX;
   }

   public static String getElementIdFromOuterHeader(final String headerId) {
      return headerId.replace(OUTER_HEADER_SUFFIX, "");
   }

   public static String createTypeHeaderId(final String containerId) {
      return containerId + TYPE_HEADER_SUFFIX;
   }

   public static String getElementIdFromTypeHeader(final String headerId) {
      return headerId.replace(TYPE_HEADER_SUFFIX, "");
   }

   public static String createHeaderLabelId(final String containerId) {
      return containerId + HEADER_LABEL_SUFFIX;
   }

   public static String getElementIdFromHeaderLabel(final String headerLabelId) {
      return headerLabelId.replace(HEADER_LABEL_SUFFIX, "");
   }

   public static String toId(final UmlModelState modelState, final EObject semanticElement) {
      String id = modelState.getIndex().getSemanticId(semanticElement).orElse(null);
      if (id == null) {
         id = EcoreUtil.getURI(semanticElement).fragment();
         modelState.getIndex().indexSemantic(id, semanticElement);
      }
      return id;
   }
}
