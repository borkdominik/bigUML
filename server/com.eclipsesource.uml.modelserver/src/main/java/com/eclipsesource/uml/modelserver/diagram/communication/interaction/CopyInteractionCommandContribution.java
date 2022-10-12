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
package com.eclipsesource.uml.modelserver.diagram.communication.interaction;

import java.util.Arrays;
import java.util.List;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

import com.eclipsesource.uml.modelserver.diagram.commons.contributions.UmlCompoundCommandContribution;
import com.google.gson.Gson;

public class CopyInteractionCommandContribution extends UmlCompoundCommandContribution {

   public static final String TYPE = "copyInteractionContribution";
   public static final String PROPERTIES = "properties";

   private static final Gson gson = new Gson();

   public static CCompoundCommand create(final List<InteractionCopyableProperties> properties) {
      CCompoundCommand addInteractionCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      addInteractionCommand.setType(TYPE);
      addInteractionCommand.getProperties().put(PROPERTIES, gson.toJsonTree(properties).toString());
      return addInteractionCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      var propertiesJSON = command.getProperties().get(PROPERTIES);
      var properties = Arrays.asList(gson.fromJson(propertiesJSON, InteractionCopyableProperties[].class));

      return new CopyInteractionCompoundCommand(domain, modelUri, properties);
   }

}
