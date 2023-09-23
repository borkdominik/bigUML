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
package com.eclipsesource.uml.modelserver.uml.elements.extend.commands;

import java.util.Optional;

import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.uml2.uml.UseCase;

import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementArgument;

public class UpdateExtendArgument extends UpdateNamedElementArgument {
   protected String extensionId;
   protected String extendedCaseId;

   public Optional<String> extensionId() {
      return Optional.ofNullable(extensionId);
   }

   public Optional<String> extendedCaseId() {
      return Optional.ofNullable(extendedCaseId);
   }

   public static Builder<?> by() {
      return new Builder<>();
   }

   public static class Builder<TArgument extends UpdateExtendArgument>
      extends UpdateNamedElementArgument.Builder<TArgument> {

      public Builder<TArgument> extensionId(final String value) {
         argument.extensionId = value;
         return this;
      }

      public Builder<TArgument> extension(final UseCase value, final EMFIdGenerator id) {
         argument.extensionId = id.getOrCreateId(value);
         return this;
      }

      public Builder<TArgument> extendedCaseId(final String value) {
         argument.extendedCaseId = value;
         return this;
      }

      public Builder<TArgument> extendedCase(final UseCase value, final EMFIdGenerator id) {
         argument.extendedCaseId = id.getOrCreateId(value);
         return this;
      }

   }
}
