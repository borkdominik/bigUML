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
package com.eclipsesource.uml.glsp.uml.communication_diagram.constants;

import com.eclipsesource.uml.glsp.util.UmlConfig;

public final class CommunicationConfig {
   public final static class Types {
      public static final String INTERACTION = UmlConfig.Types.PRE_NODE + "interaction";
      public static final String LIFELINE = UmlConfig.Types.PRE_NODE + "lifeline";
      public static final String MESSAGE = UmlConfig.Types.PRE_EDGE + "message";
      public static final String MESSAGE_LABEL_ARROW_EDGE_NAME = UmlConfig.Types.PRE_LABEL + "message-arrow-edge-name";

      public static final String ICON_INTERACTION = UmlConfig.Types.PRE_ICON + "interaction";
      public static final String ICON_MESSAGE = UmlConfig.Types.PRE_ICON + "message";
      public static final String ICON_LIFELINE = UmlConfig.Types.PRE_ICON + "lifeline";

      private Types() {}
   }

   private CommunicationConfig() {}
}
