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
package com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.interaction;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.Interaction;

import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.constants.CommunicationTypes;
import com.eclipsesource.uml.glsp.uml.handler.operations.delete.DeleteElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.interaction.RemoveInteractionContribution;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class DeleteInteractionHandler extends DeleteElementHandler<Interaction> {

   public DeleteInteractionHandler() {
      super(Representation.COMMUNICATION, CommunicationTypes.INTERACTION);
   }

   @Override
   protected CCommand command(final Interaction element) {
      return RemoveInteractionContribution.create(element);
   }
}
