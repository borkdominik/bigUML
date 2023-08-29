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
package com.eclipsesource.uml.modelserver.uml.elements.dependency.commands;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.uml2.uml.NamedElement;

import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementArgument;

public class UpdateDependencyArgument extends UpdateNamedElementArgument {
   protected Set<String> clientIds;
   protected Set<String> supplierIds;

   public Optional<Set<String>> clientIds() {
      return Optional.ofNullable(clientIds);
   }

   public Optional<Set<String>> supplierIds() {
      return Optional.ofNullable(supplierIds);
   }

   public static Builder<?> by() {
      return new Builder<>();
   }

   public static class Builder<TArgument extends UpdateDependencyArgument>
      extends UpdateNamedElementArgument.Builder<TArgument> {

      public Builder<TArgument> clientIds(final Set<String> value) {
         argument.clientIds = value;
         return this;
      }

      public Builder<TArgument> clients(final Set<NamedElement> value, final EMFIdGenerator id) {
         argument.clientIds = value.stream().map(v -> id.getOrCreateId(v)).collect(Collectors.toUnmodifiableSet());
         return this;
      }

      public Builder<TArgument> supplierIds(final Set<String> value) {
         argument.supplierIds = value;
         return this;
      }

      public Builder<TArgument> suppliers(final Set<NamedElement> value, final EMFIdGenerator id) {
         argument.supplierIds = value.stream().map(v -> id.getOrCreateId(v)).collect(Collectors.toUnmodifiableSet());
         return this;
      }

   }
}
