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
package com.eclipsesource.uml.glsp.uml.class_diagram.constants;

import com.eclipsesource.uml.glsp.utils.UmlConfig;

public final class ClassTypes {
   // CLASS DIAGRAM
   public static final String ICON_CLASS = UmlConfig.Types.PRE_ICON + "class";
   public static final String CLASS = UmlConfig.Types.PRE_NODE + "class";
   public static final String ABSTRACT_CLASS = UmlConfig.Types.PRE_NODE + "abstract-class";
   public static final String ENUMERATION = UmlConfig.Types.PRE_NODE + "enumeration";
   public static final String ICON_ENUMERATION = UmlConfig.Types.PRE_ICON + "enumeration";
   public static final String INTERFACE = UmlConfig.Types.PRE_NODE + "interface";
   public static final String ASSOCIATION = UmlConfig.Types.PRE_EDGE + "association";
   public static final String COMPOSITION = UmlConfig.Types.PRE_EDGE + "composition";
   public static final String AGGREGATION = UmlConfig.Types.PRE_EDGE + "aggregation";
   public static final String CLASS_GENERALIZATION = UmlConfig.Types.PRE_EDGE + "class-generalization";

   // SHARED WITH DEPLOYMENT AND USECASE
   public static final String LABEL_EDGE_MULTIPLICITY = UmlConfig.Types.PRE_LABEL + "edge-multiplicity";

   // SHARED WITH OBJECT DIAGRAM
   public static final String ATTRIBUTE = UmlConfig.Types.PRE_NODE + "attribute";
   public static final String PROPERTY = UmlConfig.Types.PRE_COMP_BASE + "property";
   public static final String ICON_PROPERTY = UmlConfig.Types.PRE_ICON + "property";
   public static final String LABEL_PROPERTY_NAME = UmlConfig.Types.PRE_LABEL + "property:name";
   public static final String LABEL_PROPERTY_TYPE = UmlConfig.Types.PRE_LABEL + "property:type";
   public static final String LABEL_PROPERTY_MULTIPLICITY = UmlConfig.Types.PRE_LABEL + "property:multiplicity";

   private ClassTypes() {}
}
