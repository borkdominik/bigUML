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
package com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.lifeline;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.diagram.base.semantic.UmlSemanticCommand;
import com.eclipsesource.uml.modelserver.diagram.util.UmlSemanticCommandUtil;

public class AddLifelineSemanticCommand extends UmlSemanticCommand {

   protected final Lifeline newLifeline;

   protected final Interaction parentInteraction;

   public AddLifelineSemanticCommand(final EditingDomain domain, final URI modelUri, final String parentSemanticUriFragment) {
      super(domain, modelUri);
      this.newLifeline = UMLFactory.eINSTANCE.createLifeline();
      this.parentInteraction = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment,
         Interaction.class);
   }

   public AddLifelineSemanticCommand(final EditingDomain domain, final URI modelUri, final Interaction parentInteraction) {
      super(domain, modelUri);
      this.newLifeline = UMLFactory.eINSTANCE.createLifeline();
      this.parentInteraction = parentInteraction;
   }

   @Override
   protected void doExecute() {
      newLifeline.setName(UmlSemanticCommandUtil.getNewLifelineName(parentInteraction));
      parentInteraction.getLifelines().add(newLifeline);
   }

   public Lifeline getNewLifeline() { return newLifeline; }

}
