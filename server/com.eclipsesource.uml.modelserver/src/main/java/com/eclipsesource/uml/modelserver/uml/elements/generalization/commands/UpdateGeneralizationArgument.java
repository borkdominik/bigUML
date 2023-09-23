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
package com.eclipsesource.uml.modelserver.uml.elements.generalization.commands;

import java.util.Optional;

import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.uml2.uml.Classifier;

import com.eclipsesource.uml.modelserver.uml.elements.element.UpdateElementArgument;

public class UpdateGeneralizationArgument extends UpdateElementArgument {
   protected boolean isSubstitutable;
   protected String generalId;
   protected String specificId;

   public Optional<Boolean> isSubstitutable() { return Optional.ofNullable(isSubstitutable); }

   public Optional<String> generalId() {
      return Optional.ofNullable(generalId);
   }

   public Optional<String> specificId() {
      return Optional.ofNullable(specificId);
   }

   public static Builder<?> by() {
      return new Builder<>();
   }

   public static class Builder<TArgument extends UpdateGeneralizationArgument>
      extends UpdateElementArgument.Builder<TArgument> {

      public Builder<TArgument> isSubstitutable(final boolean value) {
         argument.isSubstitutable = value;
         return this;
      }

      public Builder<TArgument> generalId(final String value) {
         argument.generalId = value;
         return this;
      }

      public Builder<TArgument> general(final Classifier value, final EMFIdGenerator id) {
         argument.generalId = id.getOrCreateId(value);
         return this;
      }

      public Builder<TArgument> specificId(final String value) {
         argument.specificId = value;
         return this;
      }

      public Builder<TArgument> specific(final Classifier value, final EMFIdGenerator id) {
         argument.specificId = id.getOrCreateId(value);
         return this;
      }
   }
}
