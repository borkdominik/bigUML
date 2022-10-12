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
package com.eclipsesource.uml.modelserver.diagram.communication_diagram.commands.interaction;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.diagram.base.semantic.UmlSemanticCommand;
import com.eclipsesource.uml.modelserver.diagram.util.UmlSemanticCommandUtil;

public class AddInteractionSemanticCommand extends UmlSemanticCommand {

   protected final Interaction newInteraction;

   public AddInteractionSemanticCommand(final EditingDomain domain, final URI modelUri) {
      super(domain, modelUri);
      this.newInteraction = UMLFactory.eINSTANCE.createInteraction();
   }

   @Override
   protected void doExecute() {
      newInteraction.setName(UmlSemanticCommandUtil.getNewInteractionName(umlModel));
      umlModel.getPackagedElements().add(newInteraction);
   }

   public Interaction getNewInteraction() { return newInteraction; }

}
