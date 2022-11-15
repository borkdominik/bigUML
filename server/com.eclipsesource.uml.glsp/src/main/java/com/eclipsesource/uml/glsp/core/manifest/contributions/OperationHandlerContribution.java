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

import org.eclipse.glsp.server.operations.OperationHandler;

import com.google.inject.Binder;
import com.google.inject.multibindings.Multibinder;

/*
 * Contributes to GLSP directly
 */
public interface OperationHandlerContribution {
   interface Creator {
      default Multibinder<OperationHandler> createOperationHandlerBinding(final Binder binder) {
         return Multibinder.newSetBinder(binder, OperationHandler.class);
      }
   }

   interface Contributor extends Creator {
      default void contributeOperationHandler(final Binder binder) {
         contributeOperationHandler(createOperationHandlerBinding(binder));
      }

      void contributeOperationHandler(Multibinder<OperationHandler> multibinder);
   }
}
