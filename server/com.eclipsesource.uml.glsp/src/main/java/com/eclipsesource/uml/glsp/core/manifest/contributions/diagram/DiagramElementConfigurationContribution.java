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

import java.util.Set;
import java.util.function.Consumer;

import com.eclipsesource.uml.glsp.core.diagram.DiagramElementConfiguration;
import com.eclipsesource.uml.modelserver.shared.manifest.supplier.ContributionBinderSupplier;
import com.eclipsesource.uml.modelserver.shared.manifest.supplier.ContributionIdSupplier;
import com.eclipsesource.uml.modelserver.shared.manifest.supplier.ContributionRepresentationSupplier;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Key;
import com.google.inject.TypeLiteral;
import com.google.inject.multibindings.MapBinder;
import com.google.inject.multibindings.Multibinder;

public interface DiagramElementConfigurationContribution
   extends ContributionBinderSupplier, ContributionIdSupplier, ContributionRepresentationSupplier {

   default void contributeDiagramElementConfiguration(
      final Consumer<Multibinder<DiagramElementConfiguration.Node>> nodeConsumer,
      final Consumer<Multibinder<DiagramElementConfiguration.Edge>> edgeConsumer) {
      var binder = contributionBinder();

      var nodeMultibinder = Multibinder.newSetBinder(binder,
         new TypeLiteral<DiagramElementConfiguration.Node>() {},
         idNamed());
      var edgeMultibinder = Multibinder.newSetBinder(binder,
         new TypeLiteral<DiagramElementConfiguration.Edge>() {},
         idNamed());

      nodeConsumer.accept(nodeMultibinder);
      edgeConsumer.accept(edgeMultibinder);

      MapBinder.newMapBinder(binder, new TypeLiteral<Representation>() {},
         new TypeLiteral<Set<DiagramElementConfiguration.Node>>() {})
         .addBinding(representation())
         .to(Key.get(new TypeLiteral<Set<DiagramElementConfiguration.Node>>() {}, idNamed()));
      MapBinder.newMapBinder(binder, new TypeLiteral<Representation>() {},
         new TypeLiteral<Set<DiagramElementConfiguration.Edge>>() {})
         .addBinding(representation())
         .to(Key.get(new TypeLiteral<Set<DiagramElementConfiguration.Edge>>() {}, idNamed()));
   }
}
