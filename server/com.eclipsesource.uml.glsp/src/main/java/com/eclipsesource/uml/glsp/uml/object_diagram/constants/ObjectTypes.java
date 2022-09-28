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
package com.eclipsesource.uml.glsp.uml.object_diagram.constants;

import com.eclipsesource.uml.glsp.utils.UmlConfig;

public final class ObjectTypes {

   // OBJECT DIAGRAM
   public static final String ICON_OBJECT = UmlConfig.Types.PRE_ICON + "object";
   public static final String OBJECT = UmlConfig.Types.PRE_NODE + "object";
   public static final String LINK = UmlConfig.Types.PRE_EDGE + "link";

   // SHARED WITH CLASS DIAGRAM
   public static final String ATTRIBUTE = UmlConfig.Types.PRE_NODE + "attribute";
   public static final String PROPERTY = UmlConfig.Types.PRE_COMP_BASE + "property";

   private ObjectTypes() {}
}
