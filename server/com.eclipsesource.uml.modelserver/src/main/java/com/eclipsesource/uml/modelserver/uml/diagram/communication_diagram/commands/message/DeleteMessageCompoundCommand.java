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
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Message;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;

public final class DeleteMessageCompoundCommand extends CompoundCommand {

   public DeleteMessageCompoundCommand(final ModelContext context, final Interaction parent,
      final Message semanticElement) {
      this.append(new DeleteMessageSemanticCommand(context, parent, semanticElement));
      this.append(new DeleteNotationElementCommand(context, semanticElement));
   }

}
