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

import com.eclipsesource.uml.modelserver.shared.codec.codecs.EmbeddedCodec;

public final class UpdateOperationArgument implements EmbeddedCodec.JsonEncodable {
   private final Boolean isAbstract;
   private final Boolean isStatic;
   private final Boolean isQuery;

   public UpdateOperationArgument(final Boolean isAbstract, final Boolean isStatic,
      final Boolean isQuery) {
      super();
      this.isAbstract = isAbstract;
      this.isStatic = isStatic;
      this.isQuery = isQuery;
   }

   public Optional<Boolean> isAbstract() { return Optional.ofNullable(isAbstract); }

   public Optional<Boolean> isStatic() { return Optional.ofNullable(isStatic); }

   public Optional<Boolean> isQuery() { return Optional.ofNullable(isQuery); }

   public static final class Builder {
      private Boolean _isAbstract;
      private Boolean _isStatic;
      private Boolean _isQuery;

      public Builder isAbstract(final boolean value) {
         this._isAbstract = value;
         return this;
      }

      public Builder isStatic(final boolean value) {
         this._isStatic = value;
         return this;
      }

      public Builder isQuery(final boolean value) {
         this._isQuery = value;
         return this;
      }

      public UpdateOperationArgument build() {
         return new UpdateOperationArgument(_isAbstract, _isStatic, _isQuery);
      }
   }
}
