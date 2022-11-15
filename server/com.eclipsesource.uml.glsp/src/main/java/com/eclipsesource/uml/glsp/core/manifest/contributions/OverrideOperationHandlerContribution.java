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

import java.util.Set;

import org.eclipse.glsp.server.operations.OperationHandler;

import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Binder;
import com.google.inject.Key;
import com.google.inject.TypeLiteral;
import com.google.inject.multibindings.MapBinder;
import com.google.inject.multibindings.Multibinder;

/*
 * Contributes to GLSP by replacing an operation handler provided by core for the specific diagram
 */
public interface OverrideOperationHandlerContribution {
   interface Creator extends BaseContribution {
      default Multibinder<OperationHandler> createOverrideOperationHandlerBinding(final Binder binder) {
         return Multibinder.newSetBinder(binder, OperationHandler.class, idNamed());
      }

      default MapBinder<Representation, Set<OperationHandler>> createDiagramOverrideOperationHandlerBinding(
         final Binder binder) {
         return MapBinder.newMapBinder(binder, new TypeLiteral<Representation>() {},
            new TypeLiteral<Set<OperationHandler>>() {});
      }
   }

   interface Contributor extends Creator, BaseRepresentationContribution {
      default void contributeOverrideOperationHandler(final Binder binder) {
         contributeOverrideOperationHandler(createOverrideOperationHandlerBinding(binder));

         createDiagramOverrideOperationHandlerBinding(binder).addBinding(representation())
            .to(Key.get(new TypeLiteral<Set<OperationHandler>>() {}, idNamed()));
      }

      void contributeOverrideOperationHandler(Multibinder<OperationHandler> multibinder);
   }
}
