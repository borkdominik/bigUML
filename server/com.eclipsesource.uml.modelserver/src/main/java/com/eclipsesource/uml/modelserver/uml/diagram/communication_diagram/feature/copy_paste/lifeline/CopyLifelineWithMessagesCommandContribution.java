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
package com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.feature.copy_paste.lifeline;

public class CopyLifelineWithMessagesCommandContribution { /*- extends BasicCommandContribution<Command> {

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
   */
}
