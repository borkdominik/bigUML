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
package com.eclipsesource.uml.glsp.old.diagram.statemachine_diagram;

public class StateMachineIdUtil {

   // STATEMACHINE
   public static String LABEL_GUARD_SUFFIX = "_guard";
   public static String LABEL_STATE_GUARD_SUFFIX = "_label_guard";
   public static String LABEL_EFFECT_SUFFIX = "_label_effect";
   public static String LABEL_TRIGGER_SUFFIX = "_label_trigger";

   // STATEMACHINE
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

   public static String createGuardLabelId(final String containerId) {
      return containerId + LABEL_GUARD_SUFFIX;
   }

   public static String getEdgeIdFromGuardLabel(final String guardLabel) {
      return guardLabel.replace(LABEL_GUARD_SUFFIX, "");
   }

}
