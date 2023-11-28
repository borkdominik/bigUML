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
package com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.handler.operation.interaction;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.glsp.uml.diagram.sequence_diagram.diagram.UmlSequence_Interaction;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateChildNodeHandler;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.CreateLocationAwareNodeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.interaction.CreateInteractionContribution;

public class CreateInteractionHandler
   extends BaseCreateChildNodeHandler<Model> implements CreateLocationAwareNodeHandler {

   public CreateInteractionHandler() {
      super(UmlSequence_Interaction.typeId());
   }

   @Override
   protected CCommand createCommand(final CreateNodeOperation operation, final Model parent) {

      validateNoInteractionPresent(parent);
      return CreateInteractionContribution.create(
         parent,
         relativeLocationOf(modelState, operation).orElse(GraphUtil.point(0, 0)));
   }

   private void validateNoInteractionPresent(final Model model) {
      if (containsInteraction(model)) {
         throw new GLSPServerException(
            "Invalid modelling: The Model " + model.getName() + " already contains an Interaction");
      }
   }

   private boolean containsInteraction(final Model lifeline) {
      return lifeline.getPackagedElements().stream()
         .filter(f -> f instanceof Interaction)
         .count() > 0;
   }
}
