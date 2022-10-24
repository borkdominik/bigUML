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
package com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.lifeline;

import java.util.Optional;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Interaction;

import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.constants.CommunicationTypes;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateChildNodeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.lifeline.AddLifelineContribution;

public class CreateLifelineHandler
   extends BaseCreateChildNodeHandler<Interaction> {

   public CreateLifelineHandler() {
      super(CommunicationTypes.LIFELINE);
   }

   @Override
   protected CCommand command(final Interaction container, final Optional<GPoint> location) {
      return AddLifelineContribution.create(
         container,
         location.orElse(GraphUtil.point(0, 0)));
   }

}
