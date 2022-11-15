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

import com.eclipsesource.uml.glsp.core.features.toolpalette.DiagramPalette;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Binder;
import com.google.inject.Key;
import com.google.inject.TypeLiteral;
import com.google.inject.multibindings.MapBinder;
import com.google.inject.multibindings.Multibinder;

public interface PaletteContribution {
   interface Creator extends BaseContribution {
      default Multibinder<DiagramPalette> createPaletteBinding(final Binder binder) {
         return Multibinder.newSetBinder(binder, DiagramPalette.class, idNamed());
      }

      default MapBinder<Representation, Set<DiagramPalette>> createDiagramPaletteBinding(final Binder binder) {
         return MapBinder.newMapBinder(binder, new TypeLiteral<Representation>() {},
            new TypeLiteral<Set<DiagramPalette>>() {});
      }
   }

   interface Contributor extends Creator, BaseRepresentationContribution {
      default void contributePalette(final Binder binder) {
         contributePalette(createPaletteBinding(binder));

         createDiagramPaletteBinding(binder).addBinding(representation())
            .to(Key.get(new TypeLiteral<Set<DiagramPalette>>() {},
               idNamed()));
      }

      void contributePalette(Multibinder<DiagramPalette> multibinder);
   }
}
