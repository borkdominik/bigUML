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
package com.eclipsesource.uml.modelserver.shared.codec.codecs;

import com.eclipsesource.uml.modelserver.shared.codec.CCommandProvider;
import com.google.gson.Gson;
import com.google.gson.JsonElement;

public interface EmbeddedCodec {
   String EMBEDDED_JSON = "embedded_json";

   interface JsonEncodable {
      default JsonElement encodeJson() {
         return new Gson().toJsonTree(this);
      }
   }

   interface Encoder<T> extends CCommandProvider {
      default T embedJson(final JsonEncodable value) {
         var gson = new Gson();
         var encoded = value.encodeJson();
         var property = gson.toJson(encoded);

         ccommand().getProperties().put(EMBEDDED_JSON, property);

         return (T) this;
      }

      default T embedJson(final Object value) {
         var gson = new Gson();
         var property = gson.toJson(value);

         ccommand().getProperties().put(EMBEDDED_JSON, property);

         return (T) this;
      }
   }

   interface Decoder extends CCommandProvider {
      default <TObject> TObject embedJson(final Class<TObject> clazz) {
         var gson = new Gson();
         var property = ccommand().getProperties().get(EMBEDDED_JSON);

         return gson.fromJson(property, clazz);
      }
   }
}
