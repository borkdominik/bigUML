/********************************************************************************
 * Copyright (c) 2022 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.borkdominik.big.glsp.uml.uml.elements.association.utils;

import org.eclipse.uml2.uml.AggregationKind;

import com.borkdominik.big.glsp.server.core.constants.BGCoreCSS;

public class AggregationKindUtil {
   public static BGCoreCSS.Marker from(final AggregationKind aggregationKind) {
      switch (aggregationKind) {
         case COMPOSITE_LITERAL:
            return BGCoreCSS.Marker.DIAMOND;
         case SHARED_LITERAL:
            return BGCoreCSS.Marker.DIAMOND_EMPTY;
         default:
            return BGCoreCSS.Marker.NONE;
      }
   }
}
