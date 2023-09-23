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
package com.eclipsesource.uml.modelserver.uml.elements.state_machine.commands;

import com.eclipsesource.uml.modelserver.uml.elements.named_element.UpdateNamedElementArgument;

public class UpdateStateMachineArgument extends UpdateNamedElementArgument {

   public static Builder<?> by() {
      return new Builder<>();
   }

   public static final class Builder<TArgument extends UpdateStateMachineArgument>
      extends UpdateNamedElementArgument.Builder<TArgument> {}
}
