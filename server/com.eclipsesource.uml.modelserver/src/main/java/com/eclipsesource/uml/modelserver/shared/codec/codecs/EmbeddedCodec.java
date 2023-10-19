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

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.shared.codec.CCommandProvider;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonSerializer;

public interface EmbeddedCodec {
   String EMBEDDED_JSON = "embedded_json";

   interface Encoder<T> extends CCommandProvider {

      default T embedJson(final Object value) {
         return embedJson(EMBEDDED_JSON, value);
      }

      default <TValue> T embedJson(final TValue value, final JsonSerializer<TValue> serializer) {
         var gson = new GsonBuilder().registerTypeAdapter(value.getClass(), serializer).create();
         var json = gson.toJson(value);

         ccommand().getProperties().put(EMBEDDED_JSON, json);

         return (T) this;
      }

      default T embedJson(final String key, final Object value) {
         var gson = new Gson();
         var json = gson.toJson(value);

         ccommand().getProperties().put(key, json);

         return (T) this;
      }

      default T embedJson(final String key, final EObject object) {

         var gson = new Gson();
         var property = gson.toJson(object);

         ccommand().getProperties().put(key, property);

         return (T) this;
      }
   }

   interface Decoder extends CCommandProvider {
      default <TObject> Optional<TObject> embedJsonOptional(final Class<TObject> clazz) {
         try {
            return Optional.of(embedJson(EMBEDDED_JSON, clazz));
         } catch (Exception e) {
            return Optional.empty();
         }
      }

      default <TObject> TObject embedJson(final Class<TObject> clazz) {
         return embedJson(EMBEDDED_JSON, clazz);
      }

      default <TObject> TObject embedJson(final String key, final Class<TObject> clazz) {
         var gson = new Gson();
         var json = ccommand().getProperties().get(key);

         return gson.fromJson(json, clazz);
      }

      default <TObject> TObject embedJson(final String key, final TypeToken<TObject> token) {
         var gson = new Gson();
         var json = ccommand().getProperties().get(key);

         return gson.fromJson(json, token.getType());
      }

      default <TValue> TValue embedJson(final Class<TValue> clazz, final JsonDeserializer<TValue> deserializer) {
         var gson = new GsonBuilder().registerTypeAdapter(clazz, deserializer).create();
         var json = ccommand().getProperties().get(EMBEDDED_JSON);

         return gson.fromJson(json, clazz);
      }

   }
}
