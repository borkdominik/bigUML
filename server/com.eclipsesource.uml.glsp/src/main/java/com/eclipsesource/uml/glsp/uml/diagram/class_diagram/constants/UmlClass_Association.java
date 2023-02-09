/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants;

import com.eclipsesource.uml.glsp.core.constants.CoreTypes;

public class UmlClass_Association {

   public static final String ID = CoreTypes.PRE_EDGE + "association";

   public static final String ASSOCIATION_TYPE_ID = CoreTypes.PRE_EDGE + "association";
   public static final String COMPOSITION_TYPE_ID = CoreTypes.PRE_EDGE + "composition";
   public static final String AGGREGATION_TYPE_ID = CoreTypes.PRE_EDGE + "aggregation";

   public enum Property {
      NAME,
      VISIBILITY_KIND
   }

   private UmlClass_Association() {}
}
