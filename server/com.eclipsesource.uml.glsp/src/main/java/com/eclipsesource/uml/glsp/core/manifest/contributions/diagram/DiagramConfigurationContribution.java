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
package com.eclipsesource.uml.glsp.core.manifest.contributions.diagram;

import java.util.function.Supplier;

import com.eclipsesource.uml.glsp.core.diagram.DiagramConfiguration;
import com.eclipsesource.uml.glsp.core.manifest.contributions.ContributionBinderSupplier;
import com.eclipsesource.uml.glsp.core.manifest.contributions.ContributionIdSupplier;
import com.eclipsesource.uml.glsp.core.manifest.contributions.ContributionRepresentationSupplier;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Key;
import com.google.inject.TypeLiteral;
import com.google.inject.multibindings.MapBinder;

public interface DiagramConfigurationContribution
   extends ContributionBinderSupplier, ContributionIdSupplier, ContributionRepresentationSupplier {

   default void contributeDiagramConfiguration(
      final Supplier<Class<? extends DiagramConfiguration>> supplier) {
      var binder = contributionBinder();

      binder.bind(DiagramConfiguration.class)
         .annotatedWith(idNamed())
         .to(supplier.get());

      MapBinder.newMapBinder(binder, Representation.class, DiagramConfiguration.class)
         .addBinding(representation())
         .to(Key.get(new TypeLiteral<DiagramConfiguration>() {}, idNamed()));
   }
}
