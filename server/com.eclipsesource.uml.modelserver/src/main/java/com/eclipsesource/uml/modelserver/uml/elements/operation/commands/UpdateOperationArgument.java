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
package com.eclipsesource.uml.modelserver.uml.elements.operation.commands;

import java.util.List;
import java.util.Optional;

import org.eclipse.uml2.uml.CallConcurrencyKind;

import com.eclipsesource.uml.modelserver.shared.model.NewListIndex;
import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementArgument;

public class UpdateOperationArgument extends UpdateNamedElementArgument {
   protected Boolean isAbstract;
   protected Boolean isStatic;
   protected Boolean isQuery;
   protected CallConcurrencyKind concurrency;
   protected List<NewListIndex> parameterIndex;

   public Optional<Boolean> isAbstract() { return Optional.ofNullable(isAbstract); }

   public Optional<Boolean> isStatic() { return Optional.ofNullable(isStatic); }

   public Optional<Boolean> isQuery() { return Optional.ofNullable(isQuery); }

   public Optional<CallConcurrencyKind> concurrency() {
      return Optional.ofNullable(concurrency);
   }

   public Optional<List<NewListIndex>> parameterIndex() {
      return Optional.ofNullable(parameterIndex);
   }

   public static Builder<?> by() {
      return new Builder<>();
   }

   public static class Builder<TArgument extends UpdateOperationArgument>
      extends UpdateNamedElementArgument.Builder<TArgument> {

      public Builder<TArgument> isAbstract(final boolean value) {
         argument.isAbstract = value;
         return this;
      }

      public Builder<TArgument> isStatic(final boolean value) {
         argument.isStatic = value;
         return this;
      }

      public Builder<TArgument> isQuery(final boolean value) {
         argument.isQuery = value;
         return this;
      }

      public Builder<TArgument> concurrency(final CallConcurrencyKind value) {
         argument.concurrency = value;
         return this;
      }

      public Builder<TArgument> parameterIndex(final List<NewListIndex> value) {
         argument.parameterIndex = value;
         return this;
      }
   }
}
