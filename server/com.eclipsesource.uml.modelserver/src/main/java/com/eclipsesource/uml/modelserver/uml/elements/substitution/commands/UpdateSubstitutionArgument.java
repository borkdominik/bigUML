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
package com.eclipsesource.uml.modelserver.uml.elements.substitution.commands;

import java.util.Optional;

import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.uml2.uml.Classifier;

import com.eclipsesource.uml.modelserver.uml.elements.realization.commands.UpdateRealizationArgument;

public class UpdateSubstitutionArgument extends UpdateRealizationArgument {
   protected String substitutedClassifierId;
   protected String contractId;

   public Optional<String> substitutedClassifierId() {
      return Optional.ofNullable(substitutedClassifierId);
   }

   public Optional<String> contractId() {
      return Optional.ofNullable(contractId);
   }

   public static Builder<?> by() {
      return new Builder<>();
   }

   public static class Builder<TArgument extends UpdateSubstitutionArgument>
      extends UpdateRealizationArgument.Builder<TArgument> {

      public Builder<TArgument> substitutedClassifierId(final String value) {
         argument.substitutedClassifierId = value;
         return this;
      }

      public Builder<TArgument> substitutedClassifier(final Classifier value, final EMFIdGenerator id) {
         argument.substitutedClassifierId = id.getOrCreateId(value);
         return this;
      }

      public Builder<TArgument> contractId(final String value) {
         argument.contractId = value;
         return this;
      }

      public Builder<TArgument> contract(final Classifier value, final EMFIdGenerator id) {
         argument.contractId = id.getOrCreateId(value);
         return this;
      }
   }
}
