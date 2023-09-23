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
package com.eclipsesource.uml.modelserver.uml.elements.association.constants;

import org.eclipse.uml2.uml.AggregationKind;

public enum AssociationType {
   ASSOCIATION,
   AGGREGATION,
   COMPOSITION;

   public AggregationKind toAggregationKind() {
      switch (this) {
         case AGGREGATION:
            return AggregationKind.SHARED_LITERAL;
         case ASSOCIATION:
            return AggregationKind.NONE_LITERAL;
         case COMPOSITION:
            return AggregationKind.COMPOSITE_LITERAL;

         default:
            throw new IllegalArgumentException();
      }
   }

   public static AssociationType from(final AggregationKind aggregationKind) {
      switch (aggregationKind) {
         case COMPOSITE_LITERAL:
            return COMPOSITION;
         case NONE_LITERAL:
            return ASSOCIATION;
         case SHARED_LITERAL:
            return AGGREGATION;

         default:
            throw new IllegalArgumentException();
      }
   }
}
