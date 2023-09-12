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
package com.eclipsesource.uml.modelserver.uml.elements.slot.commands;

import java.util.Optional;

import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.modelserver.uml.elements.element.UpdateElementArgument;

public class UpdateSlotArgument extends UpdateElementArgument {

   public String definingFeatureId;

   public Optional<String> definingFeatureId() {
      return Optional.ofNullable(definingFeatureId);
   }

   public static Builder<?> by() {
      return new Builder<>();
   }

   public static class Builder<TArgument extends UpdateSlotArgument>
      extends UpdateElementArgument.Builder<TArgument> {

      public Builder<TArgument> definingFeatureId(final String value) {
         argument.definingFeatureId = value;
         return this;
      }

      public Builder<TArgument> definingFeature(final Property value, final EMFIdGenerator id) {
         argument.definingFeatureId = id.getOrCreateId(value);
         return this;
      }
   }
}
