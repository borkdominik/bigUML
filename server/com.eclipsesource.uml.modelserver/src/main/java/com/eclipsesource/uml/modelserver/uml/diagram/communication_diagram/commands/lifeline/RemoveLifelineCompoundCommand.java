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
import org.eclipse.uml2.uml.MessageOccurrenceSpecification;

import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.message.RemoveMessageCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.notation.commands.UmlRemoveNotationElementCommand;

public class RemoveLifelineCompoundCommand extends CompoundCommand {
   public RemoveLifelineCompoundCommand(final EditingDomain domain, final URI modelUri,
      final Lifeline lifeline) {
      this.append(new RemoveLifelineSemanticCommand(domain, modelUri, lifeline));
      this.append(new UmlRemoveNotationElementCommand(domain, modelUri, lifeline));

      lifeline.getCoveredBys().forEach(fragment -> {
         var specification = (MessageOccurrenceSpecification) fragment;
         var message = specification.getMessage();

         this.append(new RemoveMessageCompoundCommand(domain, modelUri, message));
      });
   }
}
