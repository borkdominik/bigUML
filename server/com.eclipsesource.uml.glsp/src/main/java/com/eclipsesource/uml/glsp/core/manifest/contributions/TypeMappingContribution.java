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

import java.util.Map;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Binder;
import com.google.inject.Key;
import com.google.inject.TypeLiteral;
import com.google.inject.multibindings.MapBinder;

public interface TypeMappingContribution extends BaseDiagramContribution {

   default void contributeTypeMapping(final Binder binder) {
      var mapbinder = MapBinder.newMapBinder(binder, new TypeLiteral<String>() {},
         new TypeLiteral<Class<? extends EObject>>() {},
         namedRepresentation());

      contributeTypeMapping(mapbinder);

      var representationMapBinder = MapBinder.newMapBinder(binder, new TypeLiteral<Representation>() {},
         new TypeLiteral<Map<String, Class<? extends EObject>>>() {});

      representationMapBinder.addBinding(representation())
         .to(Key.get(new TypeLiteral<Map<String, Class<? extends EObject>>>() {},
            namedRepresentation()));
   }

   void contributeTypeMapping(MapBinder<String, Class<? extends EObject>> mapbinder);
}
