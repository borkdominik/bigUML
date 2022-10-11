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
package com.eclipsesource.uml.modelserver.diagram.communication.interaction;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.glsp.notation.commands.RemoveNotationElementCommand;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.modelserver.diagram.communication.lifeline.RemoveLifelineCompoundCommand;
import com.eclipsesource.uml.modelserver.diagram.util.UmlSemanticCommandUtil;

public class RemoveInteractionCompoundCommand extends CompoundCommand {

   public RemoveInteractionCompoundCommand(final EditingDomain domain, final URI modelUri,
      final String semanticUriFragment) {

      Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
      Interaction interactionToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment,
         Interaction.class);

      // Remove contained elements
      removeLifelines(interactionToRemove, domain, modelUri);

      this.append(new RemoveInteractionCommand(domain, modelUri, semanticUriFragment));
      this.append(new RemoveNotationElementCommand(domain, modelUri, semanticUriFragment));
   }

   protected void removeLifelines(final Interaction interactionToRemove, final EditingDomain domain,
      final URI modelUri) {
      for (Lifeline lifeline : interactionToRemove.getLifelines()) {
         String lifelineSemanticUriFragment = UmlSemanticCommandUtil.getSemanticUriFragment(lifeline);
         this.append(new RemoveLifelineCompoundCommand(domain, modelUri, lifelineSemanticUriFragment));
      }
   }
}
