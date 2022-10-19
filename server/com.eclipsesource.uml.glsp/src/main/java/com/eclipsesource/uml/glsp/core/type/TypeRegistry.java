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
package com.eclipsesource.uml.glsp.core.type;

import java.util.Map;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.glsp.core.common.DiagramRegistry;
import com.eclipsesource.uml.glsp.core.common.DoubleKey;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class TypeRegistry extends DiagramRegistry<String, Class<? extends EObject>> {

   @Inject
   public TypeRegistry(
      final Map<Representation, Map<String, Class<? extends EObject>>> mappings) {
      mappings.entrySet().forEach(e -> {
         var representation = e.getKey();

         e.getValue().entrySet().forEach(m -> {
            register(DoubleKey.of(representation, m.getKey()), m.getValue());
         });
      });

      debug();
   }
}
