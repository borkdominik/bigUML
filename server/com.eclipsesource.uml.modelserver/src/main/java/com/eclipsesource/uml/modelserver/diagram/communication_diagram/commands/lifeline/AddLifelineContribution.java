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
import org.eclipse.uml2.uml.Interaction;

import com.eclipsesource.uml.modelserver.diagram.base.constants.NotationKeys;
import com.eclipsesource.uml.modelserver.diagram.base.constants.SemanticKeys;
import com.eclipsesource.uml.modelserver.diagram.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.diagram.util.UmlSemanticCommandUtil;

public class AddLifelineContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "addLifelineContribution";

   public static CCompoundCommand create(final Interaction interaction, final GPoint position) {
      CCompoundCommand addLifelineCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addLifelineCommand.setType(TYPE);
      addLifelineCommand.getProperties().put(NotationKeys.POSITION_X,
         String.valueOf(position.getX()));
      addLifelineCommand.getProperties().put(NotationKeys.POSITION_Y,
         String.valueOf(position.getY()));
      addLifelineCommand.getProperties().put(SemanticKeys.PARENT_SEMANTIC_URI_FRAGMENT,
         UmlSemanticCommandUtil.getSemanticUriFragment(interaction));

      return addLifelineCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      GPoint lifelinePosition = UmlNotationCommandUtil.getGPoint(
         command.getProperties().get(NotationKeys.POSITION_X),
         command.getProperties().get(NotationKeys.POSITION_Y));

      String parentSemanticUriFragment = command.getProperties()
         .get(SemanticKeys.PARENT_SEMANTIC_URI_FRAGMENT);

      return new AddLifelineCompoundCommand(domain, modelUri, parentSemanticUriFragment, lifelinePosition);
   }

}
