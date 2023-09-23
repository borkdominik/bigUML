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
package com.eclipsesource.uml.modelserver.uml.elements.transition.commands;

import java.util.Optional;

import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementArgument;

public class UpdateTransitionArgument extends UpdateNamedElementArgument {

   protected String sourceId;
   protected String targetId;

   public Optional<String> sourceId() {
      return Optional.ofNullable(sourceId);
   }

   public Optional<String> targetId() {
      return Optional.ofNullable(targetId);
   }

   public static Builder<?> by() {
      return new Builder<>();
   }

   public static final class Builder<TArgument extends UpdateTransitionArgument>
      extends UpdateNamedElementArgument.Builder<TArgument> {

      public Builder<TArgument> sourceId(final String value) {
         argument.sourceId = value;
         return this;
      }

      public Builder<TArgument> targetId(final String value) {
         argument.targetId = value;
         return this;
      }
   }
}
