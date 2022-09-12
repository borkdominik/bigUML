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
package com.eclipsesource.uml.modelserver.commands.communication.message;

import java.util.function.Supplier;
import java.util.stream.Collectors;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Message;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.unotation.Edge;
import com.eclipsesource.uml.modelserver.unotation.SemanticProxy;
import com.eclipsesource.uml.modelserver.unotation.UnotationFactory;

public class CopyMessageEdgeCommand extends UmlNotationElementCommand {

   protected final Supplier<Message> messageSupplier;
   protected final MessageCopyableProperties properties;

   public CopyMessageEdgeCommand(final EditingDomain domain, final URI modelUri,
      final MessageCopyableProperties properties,
      final Supplier<Message> messageSupplier) {
      super(domain, modelUri);
      this.messageSupplier = messageSupplier;
      this.properties = properties;
   }

   @Override
   protected void doExecute() {
      Edge newEdge = UnotationFactory.eINSTANCE.createEdge();

      SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();

      proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUriElement(messageSupplier.get()));

      newEdge.setSemanticElement(proxy);
      newEdge.getBendPoints().addAll(properties.getNotation().bendingPoints.stream()
         .map(UmlNotationCommandUtil::getGPoint).collect(Collectors.toUnmodifiableList()));

      umlDiagram.getElements().add(newEdge);
   }

}
