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
package com.eclipsesource.uml.glsp.core.features.idgenerator;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.emf.EMFIdGenerator;

import com.google.inject.Inject;

public class IdCountContextGenerator {

   protected Map<String, Integer> count = new HashMap<>();

   @Inject
   protected EMFIdGenerator idGenerator;

   public String getOrCreateId(final EObject context) {
      var id = idGenerator.getOrCreateId(context);

      var i = count.computeIfAbsent(id, k -> -1);
      count.put(id, ++i);

      return id + "_count_context_" + i;
   }

   public void clearAll() {
      count.clear();
   }

   public Optional<Integer> clear(final EObject context) {
      var id = idGenerator.getOrCreateId(context);

      return Optional.ofNullable(count.remove(id));
   }
}
