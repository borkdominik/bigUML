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
package com.eclipsesource.uml.glsp.uml.activity_diagram;

public class ActivityIdUtil {
   public static String LABEL_WEIGHT_SUFFIX = "_weight";
   public static String LABEL_GUARD_SUFFIX = "_guard";

   public static String getEdgeFromWeightLabel(final String weightLabel) {
      return weightLabel.replace(LABEL_WEIGHT_SUFFIX, "");
   }

   public static String createWeightLabelId(final String containerId) {
      return containerId + LABEL_WEIGHT_SUFFIX;
   }

   public static String createGuardLabelId(final String containerId) {
      return containerId + LABEL_GUARD_SUFFIX;
   }

   public static String getEdgeIdFromGuardLabel(final String guardLabel) {
      return guardLabel.replace(LABEL_GUARD_SUFFIX, "");
   }
}
