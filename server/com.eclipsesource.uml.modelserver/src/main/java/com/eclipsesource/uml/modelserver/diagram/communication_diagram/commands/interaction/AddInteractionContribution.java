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

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.glsp.graph.GPoint;

import com.eclipsesource.uml.modelserver.diagram.base.constants.NotationKeys;
import com.eclipsesource.uml.modelserver.diagram.util.UmlNotationCommandUtil;

public class AddInteractionContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "addInteractionContribution";

   public static CCompoundCommand create(final GPoint position) {
      CCompoundCommand addInteractionCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addInteractionCommand.setType(TYPE);
      addInteractionCommand.getProperties().put(NotationKeys.POSITION_X,
         String.valueOf(position.getX()));
      addInteractionCommand.getProperties().put(NotationKeys.POSITION_Y,
         String.valueOf(position.getY()));
      return addInteractionCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      GPoint interactionPosition = UmlNotationCommandUtil.getGPoint(
         command.getProperties().get(NotationKeys.POSITION_X),
         command.getProperties().get(NotationKeys.POSITION_Y));

      return new AddInteractionCompoundCommand(domain, modelUri, interactionPosition);
   }

}
