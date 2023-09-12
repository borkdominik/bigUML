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
package com.eclipsesource.uml.modelserver.uml.elements.literal_specification.commands;

import java.util.Optional;

import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementArgument;

public class UpdateLiteralSpecificationArgument extends UpdateNamedElementArgument {

   protected String value;

   public Optional<String> value() {
      return Optional.ofNullable(value);
   }

   public static Builder<?> by() {
      return new Builder<>();
   }

   public static class Builder<TArgument extends UpdateLiteralSpecificationArgument>
      extends UpdateNamedElementArgument.Builder<TArgument> {

      public Builder<TArgument> value(final String value) {
         this.argument.value = value;
         return this;
      }
   }
}
