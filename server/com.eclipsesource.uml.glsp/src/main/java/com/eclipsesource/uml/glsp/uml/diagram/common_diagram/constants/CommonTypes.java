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
package com.eclipsesource.uml.glsp.uml.diagram.common_diagram.constants;

import java.util.Arrays;
import java.util.List;

import com.eclipsesource.uml.glsp.core.utils.UmlConfig;

public final class CommonTypes {

   // COMMENT
   public static final String COMMENT = UmlConfig.Types.PRE_NODE + "comment";
   public static final String COMMENT_EDGE = UmlConfig.Types.PRE_EDGE + "commentlink";
   public static final List<String> LINKS_TO_COMMENT = Arrays.asList(COMMENT);

   private CommonTypes() {}
}
