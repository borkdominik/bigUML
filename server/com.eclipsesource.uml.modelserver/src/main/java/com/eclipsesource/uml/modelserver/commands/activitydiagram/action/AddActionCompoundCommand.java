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
package com.eclipsesource.uml.modelserver.commands.activitydiagram.action;

import java.util.function.Supplier;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Action;

public class AddActionCompoundCommand extends CompoundCommand {

   public AddActionCompoundCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
      final String parentUri, final String clazzName) {

      // Chain semantic and notation command
      AddActionCommand command = new AddActionCommand(domain, modelUri, parentUri, clazzName);
      this.append(command);
      Supplier<Action> semanticResultSupplier = command::getNewAction;
      this.append(new AddActionShapeCommand(domain, modelUri, position, semanticResultSupplier));
   }

}
