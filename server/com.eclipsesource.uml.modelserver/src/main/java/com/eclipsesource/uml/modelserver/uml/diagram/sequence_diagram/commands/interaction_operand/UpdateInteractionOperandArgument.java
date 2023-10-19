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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.interaction_operand;

import java.util.Optional;

import org.eclipse.uml2.uml.VisibilityKind;

public final class UpdateInteractionOperandArgument {
   private String name;
   private String guard;
   private VisibilityKind visibilityKind;

   public Optional<String> name() {
      return Optional.ofNullable(name);
   }

   public Optional<String> guard() {
      return Optional.ofNullable(guard);
   }

   public Optional<VisibilityKind> visibilityKind() {
      return Optional.ofNullable(visibilityKind);
   }

   public static final class Builder {
      private final UpdateInteractionOperandArgument argument = new UpdateInteractionOperandArgument();

      public Builder name(final String value) {
         argument.name = value;
         return this;
      }

      public Builder guard(final String value) {
         argument.guard = value;
         return this;
      }

      public Builder visibilityKind(final VisibilityKind value) {
         argument.visibilityKind = value;
         return this;
      }

      public UpdateInteractionOperandArgument get() {
         return argument;
      }
   }
}
