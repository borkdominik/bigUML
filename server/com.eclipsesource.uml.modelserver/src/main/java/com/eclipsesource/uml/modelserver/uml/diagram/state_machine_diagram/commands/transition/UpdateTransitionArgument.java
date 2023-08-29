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
package com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.transition;

import java.util.Optional;

public class UpdateTransitionArgument {
   private String name;

   public Optional<String> name() {
      return Optional.ofNullable(name);
   }

   public static final class Builder {
      private final UpdateTransitionArgument argument = new UpdateTransitionArgument();

      public Builder name(final String value) {
         argument.name = value;
         return this;
      }

      public UpdateTransitionArgument get() {
         return argument;
      }
   }
}
