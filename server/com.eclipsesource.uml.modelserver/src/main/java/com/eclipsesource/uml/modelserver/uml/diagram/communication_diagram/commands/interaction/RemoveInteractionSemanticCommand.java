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
package com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.interaction;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Interaction;

import com.eclipsesource.uml.modelserver.uml.semantic.UmlSemanticElementCommand;

public class RemoveInteractionSemanticCommand extends UmlSemanticElementCommand {

   protected final Interaction interaction;

   public RemoveInteractionSemanticCommand(final EditingDomain domain, final URI modelUri,
      final Interaction interaction) {
      super(domain, modelUri);
      this.interaction = interaction;
   }

   @Override
   protected void doExecute() {
      model.getPackagedElements().remove(interaction);
   }
}
