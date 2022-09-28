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
package com.eclipsesource.uml.glsp.uml.utils.edge;

public final class EdgeMultiplicityIdUtil {
   public static String LABEL_MULTIIPLICITY_SUFFIX = "_label_multiplicity";

   public static String createEdgeLabelMultiplicityId(final String containerId) {
      return containerId + LABEL_MULTIIPLICITY_SUFFIX;
   }

   public static String getElementIdFromEdgeLabelMultiplicity(final String multiplicityLabelId) {
      return multiplicityLabelId.replace(LABEL_MULTIIPLICITY_SUFFIX, "");
   }

   private EdgeMultiplicityIdUtil() {}
}
