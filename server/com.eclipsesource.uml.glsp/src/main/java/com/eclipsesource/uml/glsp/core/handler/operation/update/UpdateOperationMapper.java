/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.core.handler.operation.update;

import java.util.HashMap;
import java.util.Map;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.emf.EMFIdGenerator;

import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.google.inject.Inject;

public class UpdateOperationMapper {

   @Inject
   protected EMFIdGenerator idGenerator;

   protected Gson gson;

   public UpdateOperationMapper() {
      this.gson = new Gson();
   }

   public UpdateOperation from(
      final EObject element,
      final Object args) {

      var elementId = idGenerator.getOrCreateId(element);
      var type = new TypeToken<Map<String, Object>>() {}.getType();

      return new UpdateOperation(
         elementId,
         new HashMap<>(),
         gson.fromJson(gson.toJsonTree(args), type));
   }
}
