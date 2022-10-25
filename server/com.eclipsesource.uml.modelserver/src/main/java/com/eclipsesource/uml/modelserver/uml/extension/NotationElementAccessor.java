/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.extension;

import java.util.Optional;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.resource.Resource;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.notation.integration.NotationResource;
import org.eclipse.glsp.server.emf.model.notation.Diagram;
import org.eclipse.glsp.server.emf.model.notation.NotationElement;

public final class NotationElementAccessor {
   private final Diagram diagram;

   public NotationElementAccessor(final URI modelUri, final EditingDomain domain) {
      Resource notationResource = domain.getResourceSet()
         .getResource(modelUri.trimFileExtension().appendFileExtension(NotationResource.FILE_EXTENSION), false);
      EObject notationRoot = notationResource.getContents().get(0);

      this.diagram = (Diagram) notationRoot;
   }

   public NotationElementAccessor(final Diagram diagram) {
      this.diagram = diagram;
   }

   public Diagram getDiagram() { return this.diagram; }

   public <C extends NotationElement> C getElement(final String semanticUri, final Class<C> clazz) {
      NotationElement element = getElement(semanticUri);
      return clazz.cast(element);
   }

   public NotationElement getElement(final String semanticUri) {
      Optional<NotationElement> notationElement = diagram.getElements().stream()
         .filter(el -> el.getSemanticElement().getElementId().equals(semanticUri)).findFirst();
      return notationElement.orElse(null);
   }
}
