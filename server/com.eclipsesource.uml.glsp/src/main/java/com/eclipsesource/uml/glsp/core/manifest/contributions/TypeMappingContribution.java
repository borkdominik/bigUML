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

import com.eclipsesource.uml.glsp.core.type.TypeMapping;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Binder;
import com.google.inject.TypeLiteral;
import com.google.inject.multibindings.MapBinder;

public interface TypeMappingContribution {

   default void contributeTypeMapping(final Binder binder) {
      var provider = MapBinder.newMapBinder(binder, new TypeLiteral<Representation>() {},
         new TypeLiteral<Map<String, Class<? extends EObject>>>() {},
         TypeMapping.class);
      contributeTypeMapping(provider);
   }

   void contributeTypeMapping(MapBinder<Representation, Map<String, Class<? extends EObject>>> mapbinder);
}
