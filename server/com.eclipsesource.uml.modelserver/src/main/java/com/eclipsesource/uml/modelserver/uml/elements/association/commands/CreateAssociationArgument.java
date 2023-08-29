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
package com.eclipsesource.uml.modelserver.uml.elements.association.commands;

import java.lang.reflect.Type;

import com.eclipsesource.uml.modelserver.shared.command.SerializableArgument;
import com.eclipsesource.uml.modelserver.uml.elements.association.constants.AssociationType;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

public final class CreateAssociationArgument implements SerializableArgument {
   public final AssociationType type;

   public CreateAssociationArgument(final AssociationType type) {
      super();
      this.type = type;
   }

   @Override
   public JsonSerializer serializer() {
      return new Serializer();
   }

   @Override
   public JsonDeserializer deserializer() {
      return new Deserializer();
   }

   public static class Serializer implements JsonSerializer<CreateAssociationArgument> {
      @Override
      public JsonElement serialize(final CreateAssociationArgument src, final Type typeOfSrc,
         final JsonSerializationContext context) {
         var obj = new JsonObject();
         obj.addProperty("type", src.type.name());
         return null;
      }
   }

   public static class Deserializer implements JsonDeserializer<CreateAssociationArgument> {
      @Override
      public CreateAssociationArgument deserialize(final JsonElement json, final Type typeOfT,
         final JsonDeserializationContext context)
         throws JsonParseException {
         var jsonObject = json.getAsJsonObject();

         return new CreateAssociationArgument(
            AssociationType.valueOf(jsonObject.get("type").getAsString()));
      }
   }
}
