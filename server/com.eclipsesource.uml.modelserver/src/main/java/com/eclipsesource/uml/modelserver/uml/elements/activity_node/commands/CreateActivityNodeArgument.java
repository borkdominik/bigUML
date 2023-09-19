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
package com.eclipsesource.uml.modelserver.uml.elements.activity_node.commands;

import java.lang.reflect.Type;

import org.eclipse.uml2.uml.ActivityNode;

import com.eclipsesource.uml.modelserver.shared.command.SerializableArgument;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

public final class CreateActivityNodeArgument implements SerializableArgument {
   public final Class<? extends ActivityNode> nodeLiteral;

   public CreateActivityNodeArgument(
      final Class<? extends ActivityNode> nodeLiteral) {
      super();
      this.nodeLiteral = nodeLiteral;
   }

   @Override
   public JsonSerializer serializer() {
      return new Serializer();
   }

   @Override
   public JsonDeserializer deserializer() {
      return new Deserializer();
   }

   public static class Serializer implements JsonSerializer<CreateActivityNodeArgument> {
      @Override
      public JsonElement serialize(final CreateActivityNodeArgument src, final Type typeOfSrc,
         final JsonSerializationContext context) {
         var obj = new JsonObject();
         obj.addProperty("nodeLiteral", src.nodeLiteral.getName());
         return obj;
      }
   }

   public static class Deserializer implements JsonDeserializer<CreateActivityNodeArgument> {
      @Override
      public CreateActivityNodeArgument deserialize(final JsonElement json, final Type typeOfT,
         final JsonDeserializationContext context)
         throws JsonParseException {
         var jsonObject = json.getAsJsonObject();
         var nodeLiteralStr = jsonObject.get("nodeLiteral").getAsString();
         try {
            var nodeLiteral = (Class<? extends ActivityNode>) Class.forName(nodeLiteralStr);
            return new CreateActivityNodeArgument(nodeLiteral);
         } catch (ClassNotFoundException e) {
            e.printStackTrace();
            throw new IllegalStateException(e);
         }

      }
   }

}
