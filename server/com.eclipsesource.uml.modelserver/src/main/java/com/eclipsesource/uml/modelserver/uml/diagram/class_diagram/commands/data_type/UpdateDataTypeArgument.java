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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.data_type;

import java.util.List;
import java.util.Optional;

import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.modelserver.shared.codec.codecs.EmbeddedCodec;

public final class UpdateDataTypeArgument implements EmbeddedCodec.JsonEncodable {
   private final String name;
   private final String label;
   private final Boolean isAbstract;
   private final VisibilityKind visibilityKind;
   private final List<Property> ownedAttributes;

   public UpdateDataTypeArgument(final String name, final String label, final Boolean isAbstract,
      final VisibilityKind visibilityKind,
      final List<Property> ownedAttributes) {
      super();
      this.name = name;
      this.label = label;
      this.isAbstract = isAbstract;
      this.visibilityKind = visibilityKind;
      this.ownedAttributes = ownedAttributes;
   }

   public Optional<String> name() {
      return Optional.ofNullable(name);
   }

   public Optional<String> label() {
      return Optional.ofNullable(label);
   }

   public Optional<Boolean> isAbstract() { return Optional.ofNullable(isAbstract); }

   public Optional<VisibilityKind> visibilityKind() {
      return Optional.ofNullable(visibilityKind);
   }

   public Optional<List<Property>> ownedAttributes() {
      return Optional.ofNullable(ownedAttributes);
   }

   public static final class Builder {
      private Boolean isAbstract;
      private VisibilityKind visibilityKind;

      public Builder isAbstract(final boolean value) {
         this.isAbstract = value;
         return this;
      }

      public Builder visibilityKind(final VisibilityKind value) {
         this.visibilityKind = value;
         return this;
      }

      public UpdateDataTypeArgument build() {
         return new UpdateDataTypeArgument(null, null, isAbstract, visibilityKind, null);
      }
   }
}