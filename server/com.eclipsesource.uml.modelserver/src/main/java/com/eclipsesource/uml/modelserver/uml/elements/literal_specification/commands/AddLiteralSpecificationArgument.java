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
package com.eclipsesource.uml.modelserver.uml.elements.literal_specification.commands;

import java.lang.reflect.Type;

import org.eclipse.uml2.uml.LiteralSpecification;

import com.eclipsesource.uml.modelserver.shared.command.SerializableArgument;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

public class AddLiteralSpecificationArgument implements SerializableArgument {
   public final Class<? extends LiteralSpecification> literalSpecification;

   public AddLiteralSpecificationArgument(final Class<? extends LiteralSpecification> literalSpecification) {
      super();
      this.literalSpecification = literalSpecification;
   }

   @Override
   public JsonSerializer serializer() {
      return new Serializer();
   }

   @Override
   public JsonDeserializer deserializer() {
      return new Deserializer();
   }

   public static class Serializer implements JsonSerializer<AddLiteralSpecificationArgument> {
      @Override
      public JsonElement serialize(final AddLiteralSpecificationArgument src, final Type typeOfSrc,
         final JsonSerializationContext context) {
         var obj = new JsonObject();
         obj.addProperty("literal_name", src.literalSpecification.getName());
         return obj;
      }
   }

   public static class Deserializer implements JsonDeserializer<AddLiteralSpecificationArgument> {
      @Override
      public AddLiteralSpecificationArgument deserialize(final JsonElement json, final Type typeOfT,
         final JsonDeserializationContext context)
         throws JsonParseException {
         var jsonObject = json.getAsJsonObject();
         var literal = jsonObject.get("literal_name").getAsString();
         try {
            return new AddLiteralSpecificationArgument((Class<? extends LiteralSpecification>) Class.forName(literal));
         } catch (ClassNotFoundException e) {
            e.printStackTrace();
            throw new IllegalStateException(e);
         }

      }
   }

}
