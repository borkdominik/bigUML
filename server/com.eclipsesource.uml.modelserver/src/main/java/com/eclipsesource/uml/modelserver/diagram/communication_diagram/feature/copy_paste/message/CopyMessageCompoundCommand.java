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
package com.eclipsesource.uml.modelserver.diagram.communication_diagram.feature.copy_paste.message;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Lifeline;
import org.eclipse.uml2.uml.Message;

public class CopyMessageCompoundCommand extends CompoundCommand {
   private final EditingDomain domain;
   private final URI modelUri;

   public CopyMessageCompoundCommand(final EditingDomain domain, final URI modelUri,
      final List<MessageCopyableProperties> propertiesList, final Map<String, Lifeline> lifelineMappings) {
      this.domain = domain;
      this.modelUri = modelUri;

      var messagesToAdd = propertiesList.stream().filter(properties -> hasBothEnds(properties, lifelineMappings))
         .collect(Collectors.toUnmodifiableList());

      messagesToAdd.forEach(originalMessage -> {
         appendMessage(originalMessage, lifelineMappings);
      });
   }

   private Message appendMessage(final MessageCopyableProperties properties,
      final Map<String, Lifeline> lifelineMappings) {
      var source = lifelineMappings.get(properties.getSemantic().sourceId);
      var target = lifelineMappings.get(properties.getSemantic().targetId);
      var command = new CopyMessageCommand(domain, modelUri, properties, source, target);

      this.append(command);
      this.append(new CopyMessageEdgeCommand(domain, modelUri, properties, () -> command.getNewMessage()));

      return command.getNewMessage();
   }

   private boolean hasBothEnds(final MessageCopyableProperties properties,
      final Map<String, Lifeline> lifelineMappings) {
      var source = properties.getSemantic().sourceId;
      var target = properties.getSemantic().targetId;

      return lifelineMappings.containsKey(source) && lifelineMappings.containsKey(target);
   }
}
