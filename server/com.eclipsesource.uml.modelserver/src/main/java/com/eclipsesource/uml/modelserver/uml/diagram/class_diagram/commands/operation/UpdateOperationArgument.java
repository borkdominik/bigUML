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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.operation;

import java.util.Optional;

import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.modelserver.shared.codec.codecs.EmbeddedCodec;

public final class UpdateOperationArgument implements EmbeddedCodec.JsonEncodable {
   private final Boolean isAbstract;
   private final Boolean isStatic;
   private final Boolean isQuery;
   private final VisibilityKind visibilityKind;

   public UpdateOperationArgument(final Boolean isAbstract, final Boolean isStatic,
      final Boolean isQuery, final VisibilityKind visibilityKind) {
      super();
      this.isAbstract = isAbstract;
      this.isStatic = isStatic;
      this.isQuery = isQuery;
      this.visibilityKind = visibilityKind;
   }

   public Optional<Boolean> isAbstract() { return Optional.ofNullable(isAbstract); }

   public Optional<Boolean> isStatic() { return Optional.ofNullable(isStatic); }

   public Optional<Boolean> isQuery() { return Optional.ofNullable(isQuery); }

   public Optional<VisibilityKind> visibilityKind() {
      return Optional.ofNullable(visibilityKind);
   }

   public static final class Builder {
      private Boolean isAbstract;
      private Boolean isStatic;
      private Boolean isQuery;
      private VisibilityKind visibilityKind;

      public Builder isAbstract(final boolean value) {
         this.isAbstract = value;
         return this;
      }

      public Builder isStatic(final boolean value) {
         this.isStatic = value;
         return this;
      }

      public Builder isQuery(final boolean value) {
         this.isQuery = value;
         return this;
      }

      public Builder visibilityKind(final VisibilityKind value) {
         this.visibilityKind = value;
         return this;
      }

      public UpdateOperationArgument build() {
         return new UpdateOperationArgument(isAbstract, isStatic, isQuery, visibilityKind);
      }
   }
}
