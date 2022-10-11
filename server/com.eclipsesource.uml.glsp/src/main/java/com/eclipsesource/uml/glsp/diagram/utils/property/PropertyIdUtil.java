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
package com.eclipsesource.uml.glsp.diagram.utils.property;

public final class PropertyIdUtil {
   public static String PROPERTY_SUFFIX = "_property";
   public static String PROPERTY_ICON_SUFFIX = "_property_icon";
   public static String PROPERTY_LABEL_NAME_SUFFIX = "_property_label_name";
   public static String PROPERTY_LABEL_TYPE_SUFFIX = "_property_label_type";
   public static String PROPERTY_LABEL_MULTIPLICITY_SUFFIX = "_property_label_multiplicity";

   public static String createPropertyId(final String containerId) {
      return containerId + PROPERTY_SUFFIX;
   }

   public static String getElementIdFromProperty(final String propertyId) {
      return propertyId.replace(PROPERTY_SUFFIX, "");
   }

   public static String createPropertyIconId(final String containerId) {
      return containerId + PROPERTY_ICON_SUFFIX;
   }

   public static String getElementIdFromPropertyIcon(final String propertyIconId) {
      return propertyIconId.replace(PROPERTY_ICON_SUFFIX, "");
   }

   public static String createPropertyLabelNameId(final String containerId) {
      return containerId + PROPERTY_LABEL_NAME_SUFFIX;
   }

   public static String getElementIdFromPropertyLabelName(final String propertyLabelId) {
      return propertyLabelId.replace(PROPERTY_LABEL_NAME_SUFFIX, "");
   }

   public static String createPropertyLabelTypeId(final String containerId) {
      return containerId + PROPERTY_LABEL_TYPE_SUFFIX;
   }

   public static String getElementIdFromPropertyLabelType(final String propertyLabelId) {
      return propertyLabelId.replace(PROPERTY_LABEL_TYPE_SUFFIX, "");
   }

   public static String createPropertyLabelMultiplicityId(final String containerId) {
      return containerId + PROPERTY_LABEL_MULTIPLICITY_SUFFIX;
   }

   public static String getElementIdFromPropertyLabelMultiplicity(final String propertyLabelId) {
      return propertyLabelId.replace(PROPERTY_LABEL_MULTIPLICITY_SUFFIX, "");
   }

   private PropertyIdUtil() {

   }
}
