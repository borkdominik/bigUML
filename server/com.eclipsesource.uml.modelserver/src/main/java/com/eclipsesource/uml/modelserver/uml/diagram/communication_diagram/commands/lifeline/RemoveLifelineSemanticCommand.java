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

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Lifeline;

import com.eclipsesource.uml.modelserver.uml.semantic.UmlSemanticElementCommand;

public class RemoveLifelineSemanticCommand extends UmlSemanticElementCommand {

   protected final Lifeline lifeline;

   public RemoveLifelineSemanticCommand(final EditingDomain domain, final URI modelUri,
      final Lifeline lifeline) {
      super(domain, modelUri);
      this.lifeline = lifeline;
   }

   @Override
   protected void doExecute() {
      var interaction = lifeline.getInteraction();
      interaction.getLifelines().remove(lifeline);
   }

}
