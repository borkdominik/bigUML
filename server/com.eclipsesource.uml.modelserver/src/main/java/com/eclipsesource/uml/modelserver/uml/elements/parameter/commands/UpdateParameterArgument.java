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
package com.eclipsesource.uml.modelserver.uml.elements.parameter.commands;

import java.util.Optional;

import org.eclipse.uml2.uml.ParameterDirectionKind;
import org.eclipse.uml2.uml.ParameterEffectKind;

import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementArgument;

public class UpdateParameterArgument extends UpdateNamedElementArgument {
   protected Boolean isException;
   protected Boolean isStream;
   protected Boolean isOrdered;
   protected Boolean isUnique;
   protected Integer lowerBound;
   protected Integer upperBound;
   protected ParameterDirectionKind directionKind;
   protected ParameterEffectKind effectKind;
   protected String typeId;

   public Optional<Boolean> isException() { return Optional.ofNullable(isException); }

   public Optional<Boolean> isStream() { return Optional.ofNullable(isStream); }

   public Optional<Boolean> isOrdered() { return Optional.ofNullable(isOrdered); }

   public Optional<Boolean> isUnique() { return Optional.ofNullable(isUnique); }

   public Optional<ParameterDirectionKind> directionKind() {
      return Optional.ofNullable(directionKind);
   }

   public Optional<ParameterEffectKind> effectKind() {
      return Optional.ofNullable(effectKind);
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

   public static Builder<?> by() {
      return new Builder<>();
   }

   public static class Builder<TArgument extends UpdateParameterArgument>
      extends UpdateNamedElementArgument.Builder<TArgument> {

      public Builder<TArgument> isException(final boolean value) {
         argument.isException = value;
         return this;
      }

      public Builder<TArgument> isOrdered(final boolean value) {
         argument.isOrdered = value;
         return this;
      }

      public Builder<TArgument> isStream(final boolean value) {
         argument.isStream = value;
         return this;
      }

      public Builder<TArgument> isUnique(final boolean value) {
         argument.isUnique = value;
         return this;
      }

      public Builder<TArgument> typeId(final String value) {
         argument.typeId = value;
         return this;
      }

      public Builder<TArgument> effectKind(final ParameterEffectKind value) {
         argument.effectKind = value;
         return this;
      }

      public Builder<TArgument> directionKind(final ParameterDirectionKind value) {
         argument.directionKind = value;
         return this;
      }

      public Builder<TArgument> lowerBound(final int value) {
         argument.lowerBound = value;
         return this;
      }

      public Builder<TArgument> upperBound(final int value) {
         argument.upperBound = value;
         return this;
      }
   }
}
