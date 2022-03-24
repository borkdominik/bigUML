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
package com.eclipsesource.uml.modelserver.commands.activitydiagram.action;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Action;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlCompoundCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlNotationCommandContribution;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;

public class AddActionCommandContribution extends UmlCompoundCommandContribution {

   public static final String TYPE = "addActionContributuion";
   private static final String PARENT_URI = "parentUri";
   private static final String ACTION_TYPE = "actionUri";
   public static final String TIME_EVENT = "timeEvent";
   public static final String SIGNAL_EVENT = "signalEvent";

   public static CCompoundCommand create(final GPoint position, final String parentUri,
      final Class<? extends Action> clazz) {
      CCompoundCommand addActivityCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addActivityCommand.setType(TYPE);
      addActivityCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X,
         String.valueOf(position.getX()));
      addActivityCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y,
         String.valueOf(position.getY()));
      addActivityCommand.getProperties().put(PARENT_URI, parentUri);
      addActivityCommand.getProperties().put(ACTION_TYPE, clazz.getName());
      return addActivityCommand;
   }

   public static CCompoundCommand create(final GPoint position, final String parentUri,
      final boolean isTimeEvent) {
      CCompoundCommand addActivityCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addActivityCommand.setType(TYPE);
      addActivityCommand.getProperties().put(UmlNotationCommandContribution.POSITION_X,
         String.valueOf(position.getX()));
      addActivityCommand.getProperties().put(UmlNotationCommandContribution.POSITION_Y,
         String.valueOf(position.getY()));
      addActivityCommand.getProperties().put(PARENT_URI, parentUri);
      addActivityCommand.getProperties().put(ACTION_TYPE, isTimeEvent ? TIME_EVENT : SIGNAL_EVENT);
      return addActivityCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      GPoint position = UmlNotationCommandUtil.getGPoint(
         command.getProperties().get(UmlNotationCommandContribution.POSITION_X),
         command.getProperties().get(UmlNotationCommandContribution.POSITION_Y));

      String parentUri = command.getProperties().get(PARENT_URI);
      String actionType = command.getProperties().get(ACTION_TYPE);

      return new AddActionCompoundCommand(domain, modelUri, position, parentUri, actionType);
   }

}
