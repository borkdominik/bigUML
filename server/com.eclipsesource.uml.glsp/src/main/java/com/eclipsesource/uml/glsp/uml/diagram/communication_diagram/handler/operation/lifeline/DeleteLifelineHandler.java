/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.lifeline;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.Lifeline;

import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.constants.CommunicationTypes;
import com.eclipsesource.uml.glsp.uml.handler.operations.delete.DeleteElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.lifeline.RemoveLifelineContribution;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class DeleteLifelineHandler extends DeleteElementHandler<Lifeline> {

   public DeleteLifelineHandler() {
      super(Representation.COMMUNICATION, CommunicationTypes.LIFELINE);
   }

   @Override
   protected CCommand delete(final Lifeline element) {
      return RemoveLifelineContribution.create(element);
   }

}
