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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants;

import com.eclipsesource.uml.glsp.core.constants.CoreTypes;

public final class ClassTypes {
   // CLASS DIAGRAM
   public static final String ICON_CLASS = CoreTypes.PRE_ICON + "class";
   public static final String CLASS = CoreTypes.PRE_NODE + "class";
   public static final String ABSTRACT_CLASS = CoreTypes.PRE_NODE + "abstract-class";
   public static final String ENUMERATION = CoreTypes.PRE_NODE + "enumeration";
   public static final String ICON_ENUMERATION = CoreTypes.PRE_ICON + "enumeration";
   public static final String INTERFACE = CoreTypes.PRE_NODE + "interface";
   public static final String ASSOCIATION = CoreTypes.PRE_EDGE + "association";
   public static final String COMPOSITION = CoreTypes.PRE_EDGE + "composition";
   public static final String AGGREGATION = CoreTypes.PRE_EDGE + "aggregation";
   public static final String CLASS_GENERALIZATION = CoreTypes.PRE_EDGE + "class-generalization";

   // SHARED WITH DEPLOYMENT AND USECASE
   public static final String LABEL_EDGE_MULTIPLICITY = CoreTypes.PRE_LABEL + "edge-multiplicity";

   // SHARED WITH OBJECT DIAGRAM
   public static final String ATTRIBUTE = CoreTypes.PRE_NODE + "attribute";
   public static final String PROPERTY = CoreTypes.PRE_COMP_BASE + "property";
   public static final String ICON_PROPERTY = CoreTypes.PRE_ICON + "property";
   public static final String LABEL_PROPERTY_NAME = CoreTypes.PRE_LABEL + "property:name";
   public static final String LABEL_PROPERTY_TYPE = CoreTypes.PRE_LABEL + "property:type";
   public static final String LABEL_PROPERTY_MULTIPLICITY = CoreTypes.PRE_LABEL + "property:multiplicity";

   private ClassTypes() {}
}
