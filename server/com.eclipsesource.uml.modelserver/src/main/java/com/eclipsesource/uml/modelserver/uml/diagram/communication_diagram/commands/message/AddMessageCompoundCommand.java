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
import org.eclipse.uml2.uml.Lifeline;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlAddEdgeCommand;

public class AddMessageCompoundCommand extends CompoundCommand {

   public AddMessageCompoundCommand(final ModelContext context,
      final Lifeline source, final Lifeline target) {

      var command = new AddMessageSemanticCommand(context, source, target);

      this.append(command);
      this.append(new UmlAddEdgeCommand(context, () -> command.getNewMessage()));
   }

}
