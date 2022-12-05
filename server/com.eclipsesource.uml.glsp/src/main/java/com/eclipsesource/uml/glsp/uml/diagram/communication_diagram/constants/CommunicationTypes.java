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
package com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.constants;

import com.eclipsesource.uml.glsp.core.constants.CoreTypes;

public final class CommunicationTypes {
   public static final String INTERACTION = CoreTypes.PRE_NODE + "interaction";
   public static final String LIFELINE = CoreTypes.PRE_NODE + "lifeline";
   public static final String MESSAGE = CoreTypes.PRE_EDGE + "message";
   public static final String MESSAGE_LABEL_ARROW_EDGE_NAME = CoreTypes.PRE_LABEL + "message-arrow-edge-name";

   public static final String ICON_INTERACTION = CoreTypes.PRE_ICON + "interaction";
   public static final String ICON_MESSAGE = CoreTypes.PRE_ICON + "message";
   public static final String ICON_LIFELINE = CoreTypes.PRE_ICON + "lifeline";

   private CommunicationTypes() {}
}
