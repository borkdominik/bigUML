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
package com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.usecase;

import java.util.Optional;

import com.eclipsesource.uml.modelserver.shared.codec.codecs.EmbeddedCodec;

public class UpdateUseCaseArgument implements EmbeddedCodec.JsonEncodable {

   private String name;
   private String label;
   private Boolean isAbstract;

   public Optional<String> name() {
      return Optional.ofNullable(name);
   }

   public Optional<String> label() {
      return Optional.ofNullable(label);
   }

   public Optional<Boolean> isAbstract() { return Optional.ofNullable(isAbstract); }

   public static final class Builder {
      private final UpdateUseCaseArgument argument = new UpdateUseCaseArgument();

      public Builder name(final String value) {
         argument.name = value;
         return this;
      }

      public Builder label(final String value) {
         argument.label = value;
         return this;
      }

      public Builder isAbstract(final boolean value) {
         argument.isAbstract = value;
         return this;
      }

      public UpdateUseCaseArgument get() {
         return argument;
      }
   }
}
