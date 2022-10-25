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
package com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.message;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Lifeline;

import com.eclipsesource.uml.modelserver.uml.notation.commands.UmlAddEdgeCommand;

public class AddMessageCompoundCommand extends CompoundCommand {

   public AddMessageCompoundCommand(final EditingDomain domain, final URI modelUri,
      final Lifeline source, final Lifeline target) {

      var command = new AddMessageSemanticCommand(domain, modelUri, source, target);

      this.append(command);
      this.append(new UmlAddEdgeCommand(domain, modelUri, () -> command.getNewMessage()));
   }

}
