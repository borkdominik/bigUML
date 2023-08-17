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
package com.eclipsesource.uml.modelserver.uml.elements.package_.commands;

import java.util.Optional;

import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementArgument;

public class UpdatePackageArgument extends UpdateNamedElementArgument {
   protected String uri;

   public Optional<String> uri() {
      return Optional.ofNullable(uri);
   }

   public static Builder<?> by() {
      return new Builder<>();
   }

   public static class Builder<TArgument extends UpdatePackageArgument>
      extends UpdateNamedElementArgument.Builder<TArgument> {

      public Builder<TArgument> uri(final String value) {
         argument.uri = value;
         return this;
      }

   }
}
