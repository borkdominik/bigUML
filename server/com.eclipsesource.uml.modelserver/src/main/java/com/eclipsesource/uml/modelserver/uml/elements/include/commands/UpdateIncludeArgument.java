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
package com.eclipsesource.uml.modelserver.uml.elements.include.commands;

import java.util.Optional;

import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.uml2.uml.UseCase;

import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementArgument;

public class UpdateIncludeArgument extends UpdateNamedElementArgument {
   protected String includingCaseId;
   protected String additionId;

   public Optional<String> includingCaseId() {
      return Optional.ofNullable(includingCaseId);
   }

   public Optional<String> additionId() {
      return Optional.ofNullable(additionId);
   }

   public static Builder<?> by() {
      return new Builder<>();
   }

   public static class Builder<TArgument extends UpdateIncludeArgument>
      extends UpdateNamedElementArgument.Builder<TArgument> {

      public Builder<TArgument> includingCaseId(final String value) {
         argument.includingCaseId = value;
         return this;
      }

      public Builder<TArgument> includingCase(final UseCase value, final EMFIdGenerator id) {
         argument.includingCaseId = id.getOrCreateId(value);
         return this;
      }

      public Builder<TArgument> additionId(final String value) {
         argument.additionId = value;
         return this;
      }

      public Builder<TArgument> addition(final UseCase value, final EMFIdGenerator id) {
         argument.additionId = id.getOrCreateId(value);
         return this;
      }

   }
}
