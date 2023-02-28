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

import org.eclipse.emfcloud.modelserver.emf.common.JsonResponseMember;
import org.eclipse.emfcloud.modelserver.jsonschema.Json;
import org.jetbrains.annotations.Nullable;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.NullNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public abstract class BaseJsonProvider {

   protected ObjectNode type(final String responseType) {
      return Json.object(Json.prop(JsonResponseMember.TYPE, Json.text(responseType)));
   }

   protected JsonNode data(@Nullable final JsonNode jsonNode) {
      return Json.object(
         Json.prop(JsonResponseMember.DATA, jsonNode == null ? NullNode.getInstance() : jsonNode));
   }

   protected JsonNode data(final String message) {
      return Json.object(
         Json.prop(JsonResponseMember.DATA, Json.text(message)));
   }

   protected JsonNode data(final Boolean b) {
      return Json.object(
         Json.prop(JsonResponseMember.DATA, Json.bool(b)));
   }

}
