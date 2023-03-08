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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.utils;

import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Association;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.constants.AssociationType;

public final class AssociationTypeUtil {
   public static String toClassType(final AssociationType type) {
      switch (type) {
         case AGGREGATION:
            return UmlClass_Association.Template.aggregationTypeId();
         case ASSOCIATION:
            return UmlClass_Association.typeId();
         case COMPOSITION:
            return UmlClass_Association.Template.compositionTypeId();
         default:
            throw new IllegalArgumentException();
      }
   }
}
