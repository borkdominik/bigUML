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
package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.generalization;

import java.util.Optional;

public final class UpdateGeneralizationArgument {
   private boolean isSubstitutable;

   public Optional<Boolean> isSubstitutable() { return Optional.ofNullable(isSubstitutable); }

   public static final class Builder {
      private final UpdateGeneralizationArgument argument = new UpdateGeneralizationArgument();

      public Builder isSubstitutable(final boolean value) {
         argument.isSubstitutable = value;
         return this;
      }

      public UpdateGeneralizationArgument get() {
         return argument;
      }
   }
}
