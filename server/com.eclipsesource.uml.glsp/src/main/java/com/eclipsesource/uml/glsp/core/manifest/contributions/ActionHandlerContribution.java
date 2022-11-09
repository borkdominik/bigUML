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
package com.eclipsesource.uml.glsp.core.manifest.contributions;

import org.eclipse.glsp.server.actions.ActionHandler;

import com.google.inject.Binder;
import com.google.inject.multibindings.Multibinder;

public interface ActionHandlerContribution {
   interface Creator {
      default Multibinder<ActionHandler> createActionHandlerBinding(final Binder binder) {
         return Multibinder.newSetBinder(binder, ActionHandler.class);
      }
   }

   interface Contributor extends Creator {
      default void contributeActionHandler(final Binder binder) {
         contributeActionHandler(createActionHandlerBinding(binder));
      }

      void contributeActionHandler(Multibinder<ActionHandler> multibinder);
   }
}
