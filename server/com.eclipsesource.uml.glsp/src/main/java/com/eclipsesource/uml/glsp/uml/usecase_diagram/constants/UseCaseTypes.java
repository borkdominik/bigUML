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
package com.eclipsesource.uml.glsp.uml.usecase_diagram.constants;

import com.eclipsesource.uml.glsp.utils.UmlConfig;

public final class UseCaseTypes {
   // USECASE DIAGRAM
   public static final String ICON_USECASE = UmlConfig.Types.PRE_ICON + "usecase";
   public static final String USECASE = UmlConfig.Types.PRE_NODE + "usecase";
   public static final String EXTENSIONPOINT = UmlConfig.Types.PRE_NODE + "extensionpoint";
   public static final String ICON_PACKAGE = UmlConfig.Types.PRE_ICON + "package";
   public static final String PACKAGE = UmlConfig.Types.PRE_NODE + "package";
   public static final String LABEL_PACKAGE_NAME = UmlConfig.Types.PRE_LABEL + "package:name";
   public static final String ICON_ACTOR = UmlConfig.Types.PRE_ICON + "actor";
   public static final String ACTOR = UmlConfig.Types.PRE_NODE + "actor";
   public static final String ICON_COMPONENT = UmlConfig.Types.PRE_ICON + "component";
   public static final String COMPONENT = UmlConfig.Types.PRE_NODE + "component";
   public static final String EXTEND = UmlConfig.Types.PRE_EDGE + "extend";
   public static final String INCLUDE = UmlConfig.Types.PRE_EDGE + "include";
   public static final String GENERALIZATION = UmlConfig.Types.PRE_EDGE + "generalization";
   public static final String CONNECTIONPOINT = UmlConfig.Types.PRE_LABEL + "connectionpoint";
   public static final String USECASE_ASSOCIATION = UmlConfig.Types.PRE_EDGE + "usecase-association";

   // COMMON CANDIDATE
   public static final String STRUCTURE = "struct";

   // SHARED WITH CLASS AND DEPLOYMENT
   public static final String LABEL_EDGE_MULTIPLICITY = UmlConfig.Types.PRE_LABEL + "edge-multiplicity";

   private UseCaseTypes() {}
}
