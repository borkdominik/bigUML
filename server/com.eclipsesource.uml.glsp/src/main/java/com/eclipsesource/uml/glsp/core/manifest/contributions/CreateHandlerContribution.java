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

import com.eclipsesource.uml.glsp.core.handler.operation.create.DiagramCreateHandler;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Binder;
import com.google.inject.Key;
import com.google.inject.TypeLiteral;
import com.google.inject.multibindings.MapBinder;
import com.google.inject.multibindings.Multibinder;

public interface CreateHandlerContribution {
   interface Creator extends BaseContribution {
      default Multibinder<DiagramCreateHandler> createCreateHandlerBinding(final Binder binder) {
         return Multibinder.newSetBinder(binder, DiagramCreateHandler.class, idNamed());
      }

      default MapBinder<Representation, Set<DiagramCreateHandler>> createDiagramCreateHandlerBinding(
         final Binder binder) {
         return MapBinder.newMapBinder(binder, new TypeLiteral<Representation>() {},
            new TypeLiteral<Set<DiagramCreateHandler>>() {});
      }
   }

   interface Contributor extends Creator, BaseRepresentationContribution {
      default void contributeCreateHandler(final Binder binder) {
         contributeCreateHandler(createCreateHandlerBinding(binder));

         createDiagramCreateHandlerBinding(binder).addBinding(representation())
            .to(Key.get(new TypeLiteral<Set<DiagramCreateHandler>>() {}, idNamed()));
      }

      void contributeCreateHandler(Multibinder<DiagramCreateHandler> multibinder);
   }
}
