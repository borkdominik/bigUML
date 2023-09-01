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
package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.communication_path;

import java.util.Optional;

public final class UpdateCommunicationPathArgument {
   private String name;

   public Optional<String> name() {
      return Optional.ofNullable(name);
   }

   public static final class Builder {
      private final UpdateCommunicationPathArgument argument = new UpdateCommunicationPathArgument();

      public Builder name(final String value) {
         argument.name = value;
         return this;
      }

      public UpdateCommunicationPathArgument get() {
         return argument;
      }
   }
}
