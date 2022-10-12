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
package com.eclipsesource.uml.modelserver.diagram.communication_diagram.feature.copy_paste.lifeline;

import java.util.Arrays;
import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.uml2.uml.Interaction;

import com.eclipsesource.uml.modelserver.diagram.base.constants.SemanticKeys;
import com.eclipsesource.uml.modelserver.diagram.communication_diagram.feature.copy_paste.message.MessageCopyableProperties;
import com.eclipsesource.uml.modelserver.diagram.util.UmlCommandContributionUtil;
import com.google.gson.Gson;

public class CopyLifelineWithMessagesCommandContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "copyLifelineWithMessagesContribution";
   public static final String LIFELINE_PROPERTIES = "lifelineProperties";
   public static final String MESSAGE_PROPERTIES = "messageProperties";

   private static final Gson gson = new Gson();

   public static CCompoundCommand create(final List<LifelineCopyableProperties> lifelineProperties,
      final List<MessageCopyableProperties> messageProperties, final Interaction parentInteraction) {
      CCompoundCommand copyCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
      copyCommand.setType(TYPE);
      copyCommand.getProperties().put(LIFELINE_PROPERTIES, gson.toJsonTree(lifelineProperties).toString());
      copyCommand.getProperties().put(MESSAGE_PROPERTIES, gson.toJsonTree(messageProperties).toString());
      copyCommand.getProperties().put(SemanticKeys.PARENT_SEMANTIC_URI_FRAGMENT,
         UmlCommandContributionUtil.getSemanticUriFragment(parentInteraction));
      return copyCommand;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      var lifelinesJSON = command.getProperties().get(LIFELINE_PROPERTIES);
      var messagesJSON = command.getProperties().get(MESSAGE_PROPERTIES);
      var parentSemanticUrlFragment = command.getProperties()
         .get(SemanticKeys.PARENT_SEMANTIC_URI_FRAGMENT);

      var lifelineProperties = Arrays.asList(gson.fromJson(lifelinesJSON, LifelineCopyableProperties[].class));
      var messageProperties = Arrays.asList(gson.fromJson(messagesJSON, MessageCopyableProperties[].class));
      var parentInteraction = UmlCommandContributionUtil.fromSemanticUriFragment(modelUri, domain,
         parentSemanticUrlFragment, Interaction.class);

      return new CopyLifelineWithMessagesCompoundCommand(domain, modelUri, lifelineProperties, messageProperties,
         parentInteraction);
   }

}
