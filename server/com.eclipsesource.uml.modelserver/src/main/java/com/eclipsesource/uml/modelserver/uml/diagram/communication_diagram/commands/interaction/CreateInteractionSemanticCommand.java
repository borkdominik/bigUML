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

import org.eclipse.uml2.uml.Enumeration;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public final class CreateInteractionSemanticCommand extends BaseSemanticElementCommand {

   protected final Interaction newInteraction;

   public CreateInteractionSemanticCommand(final ModelContext context) {
      super(context);
      this.newInteraction = UMLFactory.eINSTANCE.createInteraction();
   }

   @Override
   protected void doExecute() {
      var nameGenerator = new ListNameGenerator(Enumeration.class, context.model.getPackagedElements());

      newInteraction.setName(nameGenerator.newName());
      context.model.getPackagedElements().add(newInteraction);
   }

   public Interaction getNewInteraction() { return newInteraction; }

}
