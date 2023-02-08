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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property;

import java.util.List;
import java.util.Optional;

import org.eclipse.uml2.uml.AggregationKind;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.Type;
import org.eclipse.uml2.uml.ValueSpecification;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.modelserver.shared.codec.codecs.EmbeddedCodec;

public final class UpdatePropertyArgument implements EmbeddedCodec.JsonEncodable {
   private String name;
   private String label;
   private Boolean isDerived;
   private Boolean isOrdered;
   private Boolean isStatic;
   private Boolean isDerivedUnion;
   private Boolean isReadOnly;
   private Boolean isUnique;
   private VisibilityKind visibilityKind;
   private int lowerBound;
   private int upperBound;
   private AggregationKind aggregation;

   // Reference
   private Type type;
   private ValueSpecification defaultValue;

   // References
   private List<Property> subsettedProperties;
   private List<Property> redefinedProperties;

   public Optional<String> name() {
      return Optional.ofNullable(name);
   }

   public Optional<String> label() {
      return Optional.ofNullable(label);
   }

   public Optional<Boolean> isDerived() { return Optional.ofNullable(isDerived); }

   public Optional<Boolean> isOrdered() { return Optional.ofNullable(isOrdered); }

   public Optional<Boolean> isStatic() { return Optional.ofNullable(isStatic); }

   public Optional<Boolean> isDerivedUnion() { return Optional.ofNullable(isDerivedUnion); }

   public Optional<Boolean> isReadOnly() { return Optional.ofNullable(isReadOnly); }

   public Optional<Boolean> isUnique() { return Optional.ofNullable(isUnique); }

   public Optional<VisibilityKind> visibilityKind() {
      return Optional.ofNullable(visibilityKind);
   }

   public Optional<Type> type() {
      return Optional.ofNullable(type);
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

   public Optional<AggregationKind> aggregation() {
      return Optional.ofNullable(aggregation);
   }

   public static final class Builder {
      private final UpdatePropertyArgument argument = new UpdatePropertyArgument();

      public Builder name(final String value) {
         argument.name = value;
         return this;
      }

      public Builder label(final String value) {
         argument.label = value;
         return this;
      }

      public Builder isDerived(final boolean value) {
         argument.isDerived = value;
         return this;
      }

      public Builder isOrdered(final boolean value) {
         argument.isOrdered = value;
         return this;
      }

      public Builder isStatic(final boolean value) {
         argument.isStatic = value;
         return this;
      }

      public Builder isDerivedUnion(final boolean value) {
         argument.isDerivedUnion = value;
         return this;
      }

      public Builder isReadOnly(final boolean value) {
         argument.isReadOnly = value;
         return this;
      }

      public Builder isUnique(final boolean value) {
         argument.isUnique = value;
         return this;
      }

      public Builder type(final Type value) {
         argument.type = value;
         return this;
      }

      public Builder visibilityKind(final VisibilityKind value) {
         argument.visibilityKind = value;
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

      public Builder aggregation(final AggregationKind value) {
         argument.aggregation = value;
         return this;
      }

      public UpdatePropertyArgument build() {
         return argument;
      }
   }
}
