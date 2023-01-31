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
package com.eclipsesource.uml.glsp.features.property_palette.manifest.contributions;

import java.util.Set;
import java.util.function.Consumer;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.glsp.core.manifest.contributions.ContributionBinderSupplier;
import com.eclipsesource.uml.glsp.core.manifest.contributions.ContributionIdSupplier;
import com.eclipsesource.uml.glsp.core.manifest.contributions.ContributionRepresentationSupplier;
import com.eclipsesource.uml.glsp.features.property_palette.mapper.DiagramElementPropertyMapper;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Key;
import com.google.inject.TypeLiteral;
import com.google.inject.multibindings.MapBinder;
import com.google.inject.multibindings.Multibinder;

public interface DiagramElementPropertyMapperContribution
   extends ContributionBinderSupplier, ContributionIdSupplier, ContributionRepresentationSupplier {

   interface Definition extends ContributionBinderSupplier {
      default void defineDiagramElementPropertyMapperContribution() {
         var binder = contributionBinder();

         MapBinder.newMapBinder(binder, new TypeLiteral<Representation>() {},
            new TypeLiteral<Set<DiagramElementPropertyMapper<? extends EObject>>>() {});
      }
   }

   default void contributeDiagramElementPropertyMappers(
      final Consumer<Multibinder<DiagramElementPropertyMapper<? extends EObject>>> consumer) {
      var binder = contributionBinder();

      var multibinder = Multibinder.newSetBinder(binder,
         new TypeLiteral<DiagramElementPropertyMapper<? extends EObject>>() {},
         idNamed());

      consumer.accept(multibinder);

      MapBinder.newMapBinder(binder, new TypeLiteral<Representation>() {},
         new TypeLiteral<Set<DiagramElementPropertyMapper<? extends EObject>>>() {})
         .addBinding(representation())
         .to(Key.get(new TypeLiteral<Set<DiagramElementPropertyMapper<? extends EObject>>>() {},
            idNamed()));
   }

}
