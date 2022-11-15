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

import com.eclipsesource.uml.glsp.core.diagram.DiagramConfiguration;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Binder;
import com.google.inject.Key;
import com.google.inject.TypeLiteral;
import com.google.inject.multibindings.MapBinder;

public interface DiagramConfigurationContribution {
   interface Creator extends BaseContribution {
      default MapBinder<Representation, DiagramConfiguration> createDiagramConfigurationBinding(
         final Binder binder) {
         return MapBinder.newMapBinder(binder, Representation.class,
            DiagramConfiguration.class);
      }
   }

   interface Contributor extends Creator, BaseRepresentationContribution {
      default void contributeDiagramConfiguration(final Binder binder) {
         var configuration = contributeDiagramConfiguration();
         binder.bind(DiagramConfiguration.class).annotatedWith(idNamed())
            .to(configuration);

         createDiagramConfigurationBinding(binder).addBinding(representation())
            .to(Key.get(new TypeLiteral<DiagramConfiguration>() {}, idNamed()));
      }

      Class<? extends DiagramConfiguration> contributeDiagramConfiguration();
   }
}
