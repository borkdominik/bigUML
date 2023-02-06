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
   private final String name;
   private final String label;
   private final Boolean isDerived;
   private final Boolean isOrdered;
   private final Boolean isStatic;
   private final Boolean isDerivedUnion;
   private final Boolean isReadOnly;
   private final Boolean isUnique;
   private final VisibilityKind visibilityKind;
   private final Type type;
   private final int lowerBound;
   private final int upperBound;
   private final ValueSpecification valueSpecification;
   private final AggregationKind aggregation;
   private final List<Property> subsettedProperties;
   private final List<Property> redefinedProperties;

   public UpdatePropertyArgument(final String name, final String label, final Boolean isDerived,
      final Boolean isOrdered, final Boolean isStatic,
      final Boolean isDerivedUnion, final Boolean isReadOnly, final Boolean isUnique,
      final VisibilityKind visibilityKind, final Type type,
      final int lowerBound, final int upperBound, final ValueSpecification valueSpecification,
      final AggregationKind aggregation,
      final List<Property> subsettedProperties, final List<Property> redefinedProperties) {
      super();
      this.name = name;
      this.label = label;
      this.isDerived = isDerived;
      this.isOrdered = isOrdered;
      this.isStatic = isStatic;
      this.isDerivedUnion = isDerivedUnion;
      this.isReadOnly = isReadOnly;
      this.isUnique = isUnique;
      this.visibilityKind = visibilityKind;
      this.type = type;
      this.lowerBound = lowerBound;
      this.upperBound = upperBound;
      this.valueSpecification = valueSpecification;
      this.aggregation = aggregation;
      this.subsettedProperties = subsettedProperties;
      this.redefinedProperties = redefinedProperties;
   }

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

   public Optional<ValueSpecification> valueSpecification() {
      return Optional.ofNullable(valueSpecification);
   }

   public Optional<AggregationKind> aggregation() {
      return Optional.ofNullable(aggregation);
   }

   public Optional<List<Property>> subsettedProperties() {
      return Optional.ofNullable(subsettedProperties);
   }

   public Optional<List<Property>> redefinedProperties() {
      return Optional.ofNullable(redefinedProperties);
   }

   public static final class Builder {
      private Boolean isDerived;
      private Boolean isOrdered;
      private Boolean isStatic;
      private Boolean isDerivedUnion;
      private Boolean isReadOnly;
      private Boolean isUnique;
      private VisibilityKind visibilityKind;
      private int lowerBound;
      private int upperBound;

      public Builder isDerived(final boolean value) {
         this.isDerived = value;
         return this;
      }

      public Builder isOrdered(final boolean value) {
         this.isOrdered = value;
         return this;
      }

      public Builder isStatic(final boolean value) {
         this.isStatic = value;
         return this;
      }

      public Builder isDerivedUnion(final boolean value) {
         this.isDerivedUnion = value;
         return this;
      }

      public Builder isReadOnly(final boolean value) {
         this.isReadOnly = value;
         return this;
      }

      public Builder isUnique(final boolean value) {
         this.isUnique = value;
         return this;
      }

      public Builder visibilityKind(final VisibilityKind value) {
         this.visibilityKind = value;
         return this;
      }

      public Builder lowerBound(final int value) {
         this.lowerBound = value;
         return this;
      }

      public Builder upperBound(final int value) {
         this.upperBound = value;
         return this;
      }

      public UpdatePropertyArgument build() {
         return new UpdatePropertyArgument(null, null, isDerived, isOrdered, isStatic, isDerivedUnion, isReadOnly,
            isUnique,
            visibilityKind, null, lowerBound, upperBound, null, null, null, null);
      }
   }
}
