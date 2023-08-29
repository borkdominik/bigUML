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
package com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.state_machine;

import java.util.List;
import java.util.Optional;

import org.eclipse.uml2.uml.Pseudostate;
import org.eclipse.uml2.uml.State;
import org.eclipse.uml2.uml.Transition;

public class UpdateStateMachineArgument {
   private String name;

   // References
   private List<Pseudostate> pseudoStates;
   private List<State> states;
   private List<Transition> transitions;

   public Optional<String> name() {
      return Optional.ofNullable(name);
   }

   public static final class Builder {
      private final UpdateStateMachineArgument argument = new UpdateStateMachineArgument();

      public Builder name(final String value) {
         argument.name = value;
         return this;
      }

      public UpdateStateMachineArgument get() {
         return argument;
      }
   }
}
