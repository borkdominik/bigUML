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
package com.eclipsesource.uml.modelserver.uml.elements.control_flow.commands;

import java.util.Optional;

import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementArgument;

public class UpdateControlFlowArgument extends UpdateNamedElementArgument {
   protected String guard;
   protected Integer weight;

   public Optional<String> guard() {
      return Optional.ofNullable(guard);
   }

   public Optional<Integer> weight() {
      return Optional.ofNullable(weight);
   }

   public static Builder<?> by() {
      return new Builder<>();
   }

   public static class Builder<TArgument extends UpdateControlFlowArgument>
      extends UpdateNamedElementArgument.Builder<TArgument> {

      public Builder<TArgument> guard(final String value) {
         argument.guard = value;
         return this;
      }

      public Builder<TArgument> weight(final Integer value) {
         argument.weight = value;
         return this;
      }
   }
}
