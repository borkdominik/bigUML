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
package com.eclipsesource.uml.glsp.core.utils;

import org.eclipse.glsp.server.actions.SetDirtyStateAction;

import com.eclipsesource.uml.glsp.core.model.UmlSubscriptionListener.DirtyState;
import com.eclipsesource.uml.modelserver.core.controller.DirtyStateReason;

public class DirtyStateUtils {
   public static String convert(final DirtyState state) {
      if (state.reason.equals(DirtyStateReason.INCREMENTAL_UPDATE)) {
         return SetDirtyStateAction.Reason.OPERATION;
      }

      return state.reason;
   }
}
