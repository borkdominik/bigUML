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

   private UmlIDUtil() {
   }

   public static String LABEL_NAME_SUFFIX = "_label_name";
   public static String LABEL_MULTIIPLICITY_SUFFIX = "_label_multiplicity";
   public static String HEADER_SUFFIX = "_header";
   public static String HEADER_ICON_SUFFIX = "_header_icon";
   public static String HEADER_LABEL_SUFFIX = "_header_label";
   public static String CHILD_COMPARTMENT_SUFFIX = "_childCompartment";

   // NEW LABELS
   public static String PROPERTY_SUFFIX = "_property";
   public static String PROPERTY_ICON_SUFFIX = "_property_icon";
   public static String PROPERTY_LABEL_NAME_SUFFIX = "_property_label_name";
   public static String PROPERTY_LABEL_TYPE_SUFFIX = "_property_label_type";
   public static String PROPERTY_LABEL_MULTIPLICITY_SUFFIX = "_property_label_multiplicity";

   // ACTIVITY
   public static String LABEL_GUARD_SUFFIX = "_guard";
   public static String LABEL_WEIGHT_SUFFIX = "_weight";

   // STATEMACHINE
   public static String LABEL_STATE_GUARD_SUFFIX = "_label_guard";
   public static String LABEL_EFFECT_SUFFIX = "_label_effect";
   public static String LABEL_TRIGGER_SUFFIX = "_label_trigger";

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

   public static String getEdgeIdFromGuardLabel(final String guardLabel) {
      return guardLabel.replace(LABEL_GUARD_SUFFIX, "");
   }

   public static String getEdgeFromWeightLabel(final String weightLabel) {
      return weightLabel.replace(LABEL_WEIGHT_SUFFIX, "");
   }

   public static String createGuardLabelId(final String containerId) {
      return containerId + LABEL_GUARD_SUFFIX;
   }

   public static String createWeightLabelId(final String containerId) {
      return containerId + LABEL_WEIGHT_SUFFIX;
   }

   //STATEMACHINE
   public static String createLabelGuardId(final String containerId) {
      return containerId + LABEL_STATE_GUARD_SUFFIX;
   }

   public static String getElementIdFromLabelGuard(final String labelNameId) {
      return labelNameId.replace(LABEL_STATE_GUARD_SUFFIX, "");
   }

   public static String createLabelEffectId(final String containerId) {
      return containerId + LABEL_EFFECT_SUFFIX;
   }

   public static String getElementIdFromLabelEffect(final String labelNameId) {
      return labelNameId.replace(LABEL_EFFECT_SUFFIX, "");
   }

   public static String createLabelTriggerId(final String containerId) {
      return containerId + LABEL_TRIGGER_SUFFIX;
   }

   public static String getElementIdFromLabelTrigger(final String labelNameId) {
      return labelNameId.replace(LABEL_TRIGGER_SUFFIX, "");
   }

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

}
