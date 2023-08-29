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
package com.eclipsesource.uml.modelserver.uml.elements.interface_realization.commands;

import java.util.Optional;

import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.uml2.uml.BehavioredClassifier;
import org.eclipse.uml2.uml.Interface;

import com.eclipsesource.uml.modelserver.uml.elements.realization.commands.UpdateRealizationArgument;

public class UpdateInterfaceRealizationArgument extends UpdateRealizationArgument {

   protected String implementingClassifierId;
   protected String contractId;

   public Optional<String> implementingClassifierId() {
      return Optional.ofNullable(implementingClassifierId);
   }

   public Optional<String> contractId() {
      return Optional.ofNullable(contractId);
   }

   public static Builder<?> by() {
      return new Builder<>();
   }

   public static class Builder<TArgument extends UpdateInterfaceRealizationArgument>
      extends UpdateRealizationArgument.Builder<TArgument> {

      public Builder<TArgument> implementingClassifierId(final String value) {
         argument.implementingClassifierId = value;
         return this;
      }

      public Builder<TArgument> implementingClassifier(final BehavioredClassifier value, final EMFIdGenerator id) {
         argument.implementingClassifierId = id.getOrCreateId(value);
         return this;
      }

      public Builder<TArgument> contractId(final String value) {
         argument.contractId = value;
         return this;
      }

      public Builder<TArgument> contract(final Interface value, final EMFIdGenerator id) {
         argument.contractId = id.getOrCreateId(value);
         return this;
      }

   }
}
