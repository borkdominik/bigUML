/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.core.codec;

import java.util.Optional;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.emf.common.codecs.JsonCodecV2;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class UmlRawJsonCodec extends JsonCodecV2 {

   protected Gson gson = new Gson();

   @Override
   public Optional<EObject> decode(final String payload, final URI workspaceURI) throws DecodingException {
      return decode(payload);
   }

   @Override
   public Optional<EObject> decode(final String payload) throws DecodingException {
      var element = (JsonObject) JsonParser.parseString(payload);
      var typeString = element.get("$type").getAsString();
      try {
         var type = Class.forName(typeString);

         if (EObject.class.isAssignableFrom(type)) {
            return Optional.of((EObject) gson.fromJson(element, type));
         }
      } catch (ClassNotFoundException e) {
         e.printStackTrace();
      }

      return Optional.empty();
   }

}
