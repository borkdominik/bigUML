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
package com.eclipsesource.uml.glsp.features.outline.manifest.contributions;

import com.eclipsesource.uml.glsp.core.manifest.contributions.BaseContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.BaseRepresentationContribution;
import com.eclipsesource.uml.glsp.features.outline.generator.DiagramOutlineGenerator;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Binder;
import com.google.inject.Key;
import com.google.inject.multibindings.MapBinder;

public interface OutlineGeneratorContribution {
   interface Creator extends BaseContribution {
      default MapBinder<Representation, DiagramOutlineGenerator> createDiagramOutlineGeneratorBinding(
         final Binder binder) {
         return MapBinder.newMapBinder(binder, Representation.class,
            DiagramOutlineGenerator.class);
      }
   }

   interface Contributor extends Creator, BaseRepresentationContribution {
      default void contributeOutlineGenerator(final Binder binder) {
         var generator = contributeOutlineGenerator();
         binder.bind(DiagramOutlineGenerator.class).annotatedWith(idNamed())
            .to(generator);

         createDiagramOutlineGeneratorBinding(binder).addBinding(representation())
            .to(Key.get(DiagramOutlineGenerator.class, idNamed()));
      }

      Class<? extends DiagramOutlineGenerator> contributeOutlineGenerator();
   }
}
