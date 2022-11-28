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
package com.eclipsesource.uml.modelserver.shared.extension;

import java.util.Optional;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.server.emf.model.notation.NotationElement;

import com.eclipsesource.uml.modelserver.core.resource.UmlNotationResource;
import com.eclipsesource.uml.modelserver.unotation.UmlDiagram;

public final class NotationElementAccessor {
   private final UmlDiagram diagram;

   public NotationElementAccessor(final URI modelUri, final EditingDomain domain) {
      var notationResource = domain.getResourceSet()
         .getResource(modelUri.trimFileExtension().appendFileExtension(UmlNotationResource.FILE_EXTENSION), false);
      var notationRoot = notationResource.getContents().get(0);

      this.diagram = (UmlDiagram) notationRoot;
   }

   public NotationElementAccessor(final UmlDiagram diagram) {
      this.diagram = diagram;
   }

   public UmlDiagram getDiagram() { return this.diagram; }

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
