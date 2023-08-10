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
package com.eclipsesource.uml.modelserver.uml.elements.property.commands;

import java.util.Optional;

import org.eclipse.uml2.uml.ValueSpecification;

import com.eclipsesource.uml.modelserver.shared.codec.codecs.EmbeddedCodec;

public class UpdatePropertyArgument implements EmbeddedCodec.JsonEncodable {
   private String name;
   private Integer lowerBound;
   private Integer upperBound;

   // Reference
   private String typeId;
   private ValueSpecification defaultValue;

   public Optional<String> name() {
      return Optional.ofNullable(name);
   }

   public Optional<String> typeId() {
      return Optional.ofNullable(typeId);
   }

   public Optional<Integer> lowerBound() {
      return Optional.ofNullable(lowerBound);
   }

   public Optional<Integer> upperBound() {
      return Optional.ofNullable(upperBound);
   }

   public Optional<ValueSpecification> defaultValue() {
      return Optional.ofNullable(defaultValue);
   }

   public static final class Builder {
      private final UpdatePropertyArgument argument = new UpdatePropertyArgument();

      public Builder name(final String value) {
         argument.name = value;
         return this;
      }

      public Builder typeId(final String value) {
         argument.typeId = value;
         return this;
      }

      public Builder lowerBound(final int value) {
         argument.lowerBound = value;
         return this;
      }

      public Builder upperBound(final int value) {
         argument.upperBound = value;
         return this;
      }

      public Builder defaultValue(final ValueSpecification value) {
         argument.defaultValue = value;
         return this;
      }

      public UpdatePropertyArgument get() {
         return argument;
      }
   }
}
