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
package com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.feature.copy_paste.message;

public class CopyMessageEdgeCommand { /*- extends UmlNotationElementCommand {

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
      var newEdge = NotationFactory.eINSTANCE.createEdge();

      var proxy = NotationFactory.eINSTANCE.createSemanticElementReference();

      proxy.setElementId(UmlNotationCommandUtil.getSemanticProxyUriElement(messageSupplier.get()));

      newEdge.setSemanticElement(proxy);
      newEdge.getBendPoints().addAll(properties.getNotation().bendingPoints.stream()
         .map(UmlNotationCommandUtil::getGPoint).collect(Collectors.toUnmodifiableList()));

      diagram.getElements().add(newEdge);
   }
   */
}
