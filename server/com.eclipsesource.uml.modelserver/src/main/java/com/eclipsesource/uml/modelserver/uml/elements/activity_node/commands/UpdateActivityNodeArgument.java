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
package com.eclipsesource.uml.modelserver.uml.elements.activity_node.commands;

import java.util.List;
import java.util.Optional;

import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementArgument;

public class UpdateActivityNodeArgument extends UpdateNamedElementArgument {

   protected List<String> inPartitionsIds;

   public Optional<List<String>> inPartitionsIds() {
      return Optional.ofNullable(inPartitionsIds);
   }

   public static Builder<?> by() {
      return new Builder<>();
   }

   public static class Builder<TArgument extends UpdateActivityNodeArgument>
      extends UpdateNamedElementArgument.Builder<TArgument> {

      public Builder<TArgument> inPartitionsIds(final List<String> value) {
         argument.inPartitionsIds = value;
         return this;
      }
   }

}
