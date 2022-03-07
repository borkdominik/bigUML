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

import com.eclipsesource.uml.modelserver.commands.commons.notation.RemoveNotationElementCommand;
import com.eclipsesource.uml.modelserver.commands.commons.notation.ReplaceElementCommand;

public class RemoveActivityEdgeCompoundCommand extends CompoundCommand {

   public RemoveActivityEdgeCompoundCommand(final EditingDomain domain, final URI modelUri, final String parentUri,
      final String edgeUri) {
      RemoveActivityEdgeCommand command = new RemoveActivityEdgeCommand(domain, modelUri, parentUri, edgeUri);

      this.append(command);
      this.append(new RemoveNotationElementCommand(domain, modelUri, edgeUri));

      if (command.needsToConvertSource()) {
         String sourceUri = command.getSourceUri();
         ConvertConnectedFlowElementTypeCommand convSemCmd = new ConvertConnectedFlowElementTypeCommand(domain,
            modelUri, sourceUri);
         ReplaceElementCommand replaceCmd = new ReplaceElementCommand(domain, modelUri, sourceUri,
            convSemCmd);
         this.append(convSemCmd);
         this.append(replaceCmd);
      }

      if (command.needsToConvertTarget()) {
         String targetUri = command.getTargetUri();
         ConvertConnectedFlowElementTypeCommand convSemCmd = new ConvertConnectedFlowElementTypeCommand(domain,
            modelUri, targetUri);
         ReplaceElementCommand replaceCmd = new ReplaceElementCommand(domain, modelUri, targetUri,
            convSemCmd);
         this.append(convSemCmd);
         this.append(replaceCmd);
      }
   }

}
