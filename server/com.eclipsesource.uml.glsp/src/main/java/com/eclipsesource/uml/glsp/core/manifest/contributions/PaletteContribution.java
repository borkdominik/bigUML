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

import com.eclipsesource.uml.glsp.core.palette.DiagramPalette;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Binder;
import com.google.inject.Key;
import com.google.inject.TypeLiteral;
import com.google.inject.multibindings.MapBinder;
import com.google.inject.multibindings.Multibinder;

public interface PaletteContribution extends BaseDiagramContribution {

   default void contributePalette(final Binder binder) {
      var provider = Multibinder.newSetBinder(binder, DiagramPalette.class);
      contributePalette(provider);
      var multibinder = Multibinder.newSetBinder(binder,
         new TypeLiteral<DiagramPalette>() {}, namedRepresentation());

      contributePalette(multibinder);

      var mapbinder = MapBinder.newMapBinder(binder, new TypeLiteral<Representation>() {},
         new TypeLiteral<Set<DiagramPalette>>() {});

      mapbinder.addBinding(representation())
         .to(Key.get(new TypeLiteral<Set<DiagramPalette>>() {},
            namedRepresentation()));
   }

   void contributePalette(Multibinder<DiagramPalette> multibinder);
}
