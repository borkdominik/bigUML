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
package com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.lifeline;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Lifeline;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.DeleteNotationElementCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.matcher.CommunicationDiagramCrossReferenceRemover;

public final class DeleteLifelineCompoundCommand extends CompoundCommand {
   public DeleteLifelineCompoundCommand(final ModelContext context,
      final Lifeline lifeline) {
      this.append(new DeleteLifelineSemanticCommand(context, lifeline));
      this.append(new DeleteNotationElementCommand(context, lifeline));

      new CommunicationDiagramCrossReferenceRemover(context)
         .deleteCommandsFor(lifeline)
         .forEach(this::append);
   }
}
