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
package com.eclipsesource.uml.modelserver.core.controller.response;

import org.eclipse.emfcloud.modelserver.emf.common.JsonResponseType;
import org.eclipse.emfcloud.modelserver.jsonschema.Json;

import com.fasterxml.jackson.databind.JsonNode;

public class DirtyStateProvider extends BaseJsonProvider {

   public JsonNode get(final Boolean isDirty) {
      return Json.merge(type(JsonResponseType.DIRTYSTATE), data(isDirty));
   }

   public JsonNode get(final Boolean isDirty, final String reason) {
      return Json.merge(
         type(JsonResponseType.DIRTYSTATE),
         data(
            Json.object(
               Json.prop("isDirty", Json.bool(isDirty)),
               Json.prop("reason", Json.text(reason)))));
   }
}
