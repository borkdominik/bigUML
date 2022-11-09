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

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.glsp.core.handler.operation.delete.DiagramDeleteHandler;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Binder;
import com.google.inject.Key;
import com.google.inject.TypeLiteral;
import com.google.inject.multibindings.MapBinder;
import com.google.inject.multibindings.Multibinder;

public interface DeleteHandlerContribution {
   interface Creator extends BaseContribution {
      default Multibinder<DiagramDeleteHandler<? extends EObject>> createDeleteHandlerBinding(final Binder binder) {
         return Multibinder.newSetBinder(binder, new TypeLiteral<DiagramDeleteHandler<? extends EObject>>() {},
            idNamed());
      }

      default MapBinder<Representation, Set<DiagramDeleteHandler<? extends EObject>>> createDiagramDeleteHandlerBinding(
         final Binder binder) {
         return MapBinder.newMapBinder(binder, new TypeLiteral<Representation>() {},
            new TypeLiteral<Set<DiagramDeleteHandler<? extends EObject>>>() {});
      }
   }

   interface Contributor extends Creator, BaseRepresentationContribution {
      default void contributeDeleteHandler(final Binder binder) {
         contributeDeleteHandler(createDeleteHandlerBinding(binder));

         createDiagramDeleteHandlerBinding(binder).addBinding(representation())
            .to(Key.get(new TypeLiteral<Set<DiagramDeleteHandler<? extends EObject>>>() {}, idNamed()));
      }

      void contributeDeleteHandler(Multibinder<DiagramDeleteHandler<? extends EObject>> multibinder);
   }
}
