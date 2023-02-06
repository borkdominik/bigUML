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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uclass;

import java.util.List;
import java.util.Optional;

import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.Reception;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.modelserver.shared.codec.codecs.EmbeddedCodec;

public final class UpdateClassArgument implements EmbeddedCodec.JsonEncodable {
   private final String name;
   private final String label;
   private final Boolean isAbstract;
   private final Boolean isActive;
   private final VisibilityKind visibilityKind;
   private final List<Property> ownedAttributes;
   private final List<Operation> ownedOperations;
   private final List<Reception> ownedReceptions;

   public UpdateClassArgument(final String name, final String label, final Boolean isAbstract, final Boolean isActive,
      final VisibilityKind visibilityKind, final List<Property> ownedAttributes, final List<Operation> ownedOperations,
      final List<Reception> ownedReceptions) {
      super();
      this.name = name;
      this.label = label;
      this.isAbstract = isAbstract;
      this.isActive = isActive;
      this.visibilityKind = visibilityKind;
      this.ownedAttributes = ownedAttributes;
      this.ownedOperations = ownedOperations;
      this.ownedReceptions = ownedReceptions;
   }

   public Optional<String> name() {
      return Optional.ofNullable(name);
   }

   public Optional<String> label() {
      return Optional.ofNullable(label);
   }

   public Optional<Boolean> isAbstract() { return Optional.ofNullable(isAbstract); }

   public Optional<Boolean> isActive() { return Optional.ofNullable(isActive); }

   public Optional<VisibilityKind> visibilityKind() {
      return Optional.ofNullable(visibilityKind);
   }

   public Optional<List<Property>> ownedAttributes() {
      return Optional.ofNullable(ownedAttributes);
   }

   public Optional<List<Operation>> ownedOperations() {
      return Optional.ofNullable(ownedOperations);
   }

   public Optional<List<Reception>> ownedReceptions() {
      return Optional.ofNullable(ownedReceptions);
   }

   public static final class Builder {
      private Boolean isAbstract;
      private Boolean isActive;
      private VisibilityKind visibilityKind;

      public Builder isAbstract(final boolean value) {
         this.isAbstract = value;
         return this;
      }

      public Builder isActive(final boolean value) {
         this.isActive = value;
         return this;
      }

      public Builder visibilityKind(final VisibilityKind value) {
         this.visibilityKind = value;
         return this;
      }

      public UpdateClassArgument build() {
         return new UpdateClassArgument(null, null, isAbstract, isActive, visibilityKind, null, null, null);
      }
   }
}
