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
package com.eclipsesource.uml.modelserver.commands.activitydiagram.general;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

import com.eclipsesource.uml.modelserver.commands.activitydiagram.flow.RemoveActivityEdgeCompoundCommand;
import com.eclipsesource.uml.modelserver.commands.commons.notation.RemoveNotationElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class RemoveActivityNodeCompoundCommand extends CompoundCommand {

   public RemoveActivityNodeCompoundCommand(final EditingDomain domain, final URI modelUri, final String parentUri,
      final String nodeUri) {
      RemoveActivityNodeCommand semanticCmd = new RemoveActivityNodeCommand(domain, modelUri, parentUri, nodeUri);

      // Remove connected edges
      semanticCmd.getConnectedEdges().forEach(edge -> {
         String edgeUri = UmlSemanticCommandUtil.getSemanticUriFragment(edge);
         this.append(new RemoveActivityEdgeCompoundCommand(domain, modelUri, parentUri, edgeUri));
      });

      // TODO: If instanceof Action: Remove pin edges

      this.append(semanticCmd);
      this.append(new RemoveNotationElementCommand(domain, modelUri, nodeUri));
   }

}
