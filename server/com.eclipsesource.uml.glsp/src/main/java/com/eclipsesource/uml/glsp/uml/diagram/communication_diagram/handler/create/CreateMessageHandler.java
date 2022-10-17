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
package com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.create;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.Lifeline;

import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.constants.CommunicationTypes;
import com.eclipsesource.uml.glsp.uml.handler.create.CreateEdgeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.message.AddMessageContribution;

public class CreateMessageHandler
   extends CreateEdgeHandler<Lifeline, Lifeline> {

   public CreateMessageHandler() {
      super(CommunicationTypes.MESSAGE);
   }

   @Override
   public String getLabel() { return "Communication:Message"; }

   @Override
   protected CCommand edgeCreator(final Lifeline source, final Lifeline target) {
      /*- TODO: Enable it with validation
      if (!source.getInteraction().equals(target.getInteraction())) {
         actionDispatcher.dispatch(new ServerMessageAction(Severity.ERROR,
            "Connecting Lifelines between two different Interactions is not possible.",
            3000));
      }
      */

      return AddMessageContribution.create(
         source,
         target);

   }

}
