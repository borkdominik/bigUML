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
package com.eclipsesource.uml.glsp.old.diagram.usecase_diagram.constants;

import com.eclipsesource.uml.glsp.core.constants.CoreTypes;

public final class UseCaseTypes {
   // USECASE DIAGRAM
   public static final String ICON_USECASE = CoreTypes.PRE_ICON + "usecase";
   public static final String USECASE = CoreTypes.PRE_NODE + "usecase";
   public static final String EXTENSIONPOINT = CoreTypes.PRE_NODE + "extensionpoint";
   public static final String ICON_PACKAGE = CoreTypes.PRE_ICON + "package";
   public static final String PACKAGE = CoreTypes.PRE_NODE + "package";
   public static final String LABEL_PACKAGE_NAME = CoreTypes.PRE_LABEL + "package:name";
   public static final String ICON_ACTOR = CoreTypes.PRE_ICON + "actor";
   public static final String ACTOR = CoreTypes.PRE_NODE + "actor";
   public static final String ICON_COMPONENT = CoreTypes.PRE_ICON + "component";
   public static final String COMPONENT = CoreTypes.PRE_NODE + "component";
   public static final String EXTEND = CoreTypes.PRE_EDGE + "extend";
   public static final String INCLUDE = CoreTypes.PRE_EDGE + "include";
   public static final String GENERALIZATION = CoreTypes.PRE_EDGE + "generalization";
   public static final String CONNECTIONPOINT = CoreTypes.PRE_LABEL + "connectionpoint";
   public static final String USECASE_ASSOCIATION = CoreTypes.PRE_EDGE + "usecase-association";

   // COMMON CANDIDATE
   public static final String STRUCTURE = "struct";

   // SHARED WITH CLASS AND DEPLOYMENT
   public static final String LABEL_EDGE_MULTIPLICITY = CoreTypes.PRE_LABEL + "edge-multiplicity";

   private UseCaseTypes() {}
}
