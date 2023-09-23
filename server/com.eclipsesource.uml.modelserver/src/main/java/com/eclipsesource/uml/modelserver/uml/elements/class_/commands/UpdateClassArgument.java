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
package com.eclipsesource.uml.modelserver.uml.elements.class_.commands;

import java.util.Optional;

import com.eclipsesource.uml.modelserver.uml.elements.classifier.UpdateClassifierArgument;

public class UpdateClassArgument extends UpdateClassifierArgument {
   protected Boolean isActive;

   public Optional<Boolean> isActive() { return Optional.ofNullable(isActive); }

   public static Builder<?> by() {
      return new Builder<>();
   }

   public static class Builder<TArgument extends UpdateClassArgument>
      extends UpdateClassifierArgument.Builder<TArgument> {

      public Builder<TArgument> isActive(final boolean value) {
         argument.isActive = value;
         return this;
      }

   }
}
