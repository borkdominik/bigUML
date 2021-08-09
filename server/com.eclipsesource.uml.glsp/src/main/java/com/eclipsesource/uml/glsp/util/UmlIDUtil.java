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
package com.eclipsesource.uml.glsp.util;

public final class UmlIDUtil {

   private UmlIDUtil() {}

   public static String LABEL_NAME_SUFFIX = "_label_name";
   public static String LABEL_MULTIIPLICITY_SUFFIX = "_label_multiplicity";
   public static String HEADER_SUFFIX = "_header";
   public static String HEADER_ICON_SUFFIX = "_header_icon";
   public static String HEADER_LABEL_SUFFIX = "_header_label";
   public static String CHILD_COMPARTMENT_SUFFIX = "_childCompartment";

   public static String createLabelNameId(final String containerId) {
      return containerId + LABEL_NAME_SUFFIX;
   }

   public static String getElementIdFromLabelName(final String labelNameId) {
      return labelNameId.replace(LABEL_NAME_SUFFIX, "");
   }

   public static String createLabelMultiplicityId(final String containerId) {
      return containerId + LABEL_MULTIIPLICITY_SUFFIX;
   }

   public static String getElementIdFromLabelMultiplicity(final String multiplicityLabelId) {
      return multiplicityLabelId.replace(LABEL_MULTIIPLICITY_SUFFIX, "");
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

   public static String createHeaderLabelId(final String containerId) {
      return containerId + HEADER_LABEL_SUFFIX;
   }

   public static String getElementIdFromHeaderLabel(final String headerLabelId) {
      return headerLabelId.replace(HEADER_LABEL_SUFFIX, "");
   }

   public static String createChildCompartmentId(final String containerId) {
      return containerId + CHILD_COMPARTMENT_SUFFIX;
   }

   public static String getElementIdFromChildCompartment(final String childCompartmentId) {
      return childCompartmentId.replace(CHILD_COMPARTMENT_SUFFIX, "");
   }

}
