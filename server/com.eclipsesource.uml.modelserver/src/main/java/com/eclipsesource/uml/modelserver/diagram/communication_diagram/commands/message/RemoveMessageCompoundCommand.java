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
package com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.message;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.glsp.notation.commands.RemoveNotationElementCommand;

public class RemoveMessageCompoundCommand extends CompoundCommand {

   public RemoveMessageCompoundCommand(final EditingDomain domain, final URI modelUri,
      final String semanticUriFragment) {

      this.append(new RemoveMessageCommand(domain, modelUri, semanticUriFragment));
      this.append(new RemoveNotationElementCommand(domain, modelUri, semanticUriFragment));
   }

}
