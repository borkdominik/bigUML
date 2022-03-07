/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.commands.statemachinediagram.state;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.State;

import java.util.function.Supplier;

public class AddStateCompoundCommand extends CompoundCommand {

   public AddStateCompoundCommand(final EditingDomain domain, final URI modelUri, final GPoint statePosition,
      final String regionUriFragment) {

      // Chain semantic and notation command
      AddStateCommand command = new AddStateCommand(domain, modelUri, regionUriFragment);
      this.append(command);
      Supplier<State> semanticResultSupplier = () -> command.getNewState();
      this.append(new AddStateShapeCommand(domain, modelUri, statePosition, semanticResultSupplier));
   }

}
