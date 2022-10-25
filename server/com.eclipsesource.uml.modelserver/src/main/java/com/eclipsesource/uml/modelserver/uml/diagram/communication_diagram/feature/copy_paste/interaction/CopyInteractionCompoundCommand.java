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
package com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.feature.copy_paste.interaction;

public class CopyInteractionCompoundCommand { /*- extends CompoundCommand {
   private final EditingDomain domain;
   private final URI modelUri;

   public CopyInteractionCompoundCommand(final EditingDomain domain, final URI modelUri,
      final List<InteractionCopyableProperties> propertiesList) {
      this.domain = domain;
      this.modelUri = modelUri;

      propertiesList.forEach(properties -> {
         var interaction = appendInteraction(properties);
         UmlCommandUtil.safeAppend(this,
            copyLifelineWithMessages(properties.getSemantic().lifelines, properties.getSemantic().messages,
               interaction));
      });
   }

   private Interaction appendInteraction(final InteractionCopyableProperties properties) {
      var command = new CopyInteractionCommand(domain, modelUri, properties);
      var position = UmlNotationCommandUtil.getGPoint(properties.getNotation().position);

      this.append(command);
      this.append(
         new AddShapeCommand(domain, modelUri, position, () -> command.getNewInteraction()));

      return command.getNewInteraction();
   }

   private CopyLifelineWithMessagesCompoundCommand copyLifelineWithMessages(
      final List<LifelineCopyableProperties> lifelineProperties,
      final List<MessageCopyableProperties> messageProperties, final Interaction parentInteraction) {
      return new CopyLifelineWithMessagesCompoundCommand(domain, modelUri, lifelineProperties,
         messageProperties,
         parentInteraction);
   }
   */
}
