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

import org.eclipse.uml2.uml.AggregationKind;

import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementArgument;

public class UpdatePropertyArgument extends UpdateNamedElementArgument {
   protected Boolean isDerived;
   protected Boolean isOrdered;
   protected Boolean isStatic;
   protected Boolean isDerivedUnion;
   protected Boolean isReadOnly;
   protected Boolean isUnique;
   protected Boolean isNavigable;
   protected Integer lowerBound;
   protected Integer upperBound;
   protected AggregationKind aggregation;

   // Reference
   protected String typeId;

   public Optional<Boolean> isDerived() { return Optional.ofNullable(isDerived); }

   public Optional<Boolean> isOrdered() { return Optional.ofNullable(isOrdered); }

   public Optional<Boolean> isStatic() { return Optional.ofNullable(isStatic); }

   public Optional<Boolean> isDerivedUnion() { return Optional.ofNullable(isDerivedUnion); }

   public Optional<Boolean> isReadOnly() { return Optional.ofNullable(isReadOnly); }

   public Optional<Boolean> isUnique() { return Optional.ofNullable(isUnique); }

   public Optional<Boolean> isNavigable() { return Optional.ofNullable(isNavigable); }

   public Optional<String> typeId() {
      return Optional.ofNullable(typeId);
   }

   public Optional<Integer> lowerBound() {
      return Optional.ofNullable(lowerBound);
   }

   public Optional<Integer> upperBound() {
      return Optional.ofNullable(upperBound);
   }

   public Optional<AggregationKind> aggregation() {
      return Optional.ofNullable(aggregation);
   }

   public static Builder<?> by() {
      return new Builder<>();
   }

   public static class Builder<TArgument extends UpdatePropertyArgument>
      extends UpdateNamedElementArgument.Builder<TArgument> {

      public Builder<TArgument> isDerived(final boolean value) {
         argument.isDerived = value;
         return this;
      }

      public Builder<TArgument> isOrdered(final boolean value) {
         argument.isOrdered = value;
         return this;
      }

      public Builder<TArgument> isStatic(final boolean value) {
         argument.isStatic = value;
         return this;
      }

      public Builder<TArgument> isDerivedUnion(final boolean value) {
         argument.isDerivedUnion = value;
         return this;
      }

      public Builder<TArgument> isReadOnly(final boolean value) {
         argument.isReadOnly = value;
         return this;
      }

      public Builder<TArgument> isUnique(final boolean value) {
         argument.isUnique = value;
         return this;
      }

      public Builder<TArgument> isNavigable(final boolean value) {
         argument.isNavigable = value;
         return this;
      }

      public Builder<TArgument> typeId(final String value) {
         argument.typeId = value;
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

      public Builder<TArgument> aggregation(final AggregationKind value) {
         argument.aggregation = value;
         return this;
      }
   }
}
