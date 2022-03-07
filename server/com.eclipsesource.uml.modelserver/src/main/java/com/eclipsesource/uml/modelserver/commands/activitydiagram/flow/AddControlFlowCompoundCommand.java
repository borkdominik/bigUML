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
package com.eclipsesource.uml.modelserver.commands.activitydiagram.flow;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

import com.eclipsesource.uml.modelserver.commands.commons.notation.ReplaceElementCommand;

public class AddControlFlowCompoundCommand extends CompoundCommand {

   public AddControlFlowCompoundCommand(final EditingDomain domain, final URI modelUri,
      final String sourceUri, final String targetUri) {

      // Chain semantic and notation command
      AddControlFlowCommand command = new AddControlFlowCommand(domain, modelUri, sourceUri,
         targetUri);
      this.append(command);
      this.append(new AddControlFlowEdgeCommand(domain, modelUri, command));

      if (command.needsToConvertSource()) {
         ConvertConnectedFlowElementTypeCommand convSemCmd = new ConvertConnectedFlowElementTypeCommand(domain, modelUri, sourceUri);
         ReplaceElementCommand replaceCmd = new ReplaceElementCommand(domain, modelUri, sourceUri,
            convSemCmd);
         this.append(convSemCmd);
         this.append(replaceCmd);
      }

      if (command.needsToConvertTarget()) {
         ConvertConnectedFlowElementTypeCommand convSemCmd = new ConvertConnectedFlowElementTypeCommand(domain, modelUri, targetUri);
         ReplaceElementCommand replaceCmd = new ReplaceElementCommand(domain, modelUri, targetUri,
            convSemCmd);
         this.append(convSemCmd);
         this.append(replaceCmd);
      }

   }

}
