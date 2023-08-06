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

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.emf.model.notation.NotationElement;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.utils.UmlNotationUtil;
import com.eclipsesource.uml.modelserver.unotation.UmlDiagram;

public final class NotationElementAccessor {
   private final UmlDiagram diagram;

   public NotationElementAccessor(final ModelContext context) {
      this(UmlNotationUtil.getDiagram(context));
   }

   public NotationElementAccessor(final UmlDiagram diagram) {
      this.diagram = diagram;
   }

   public UmlDiagram getDiagram() { return this.diagram; }

   public <C extends NotationElement> Optional<C> getElement(final String semanticUri, final Class<C> clazz) {
      return getElement(semanticUri).map(element -> clazz.cast(element));
   }

   public Optional<NotationElement> getElement(final EObject semantic) {
      return getElement(SemanticElementAccessor.getId(semantic));
   }

   public Optional<NotationElement> getElement(final String semanticUri) {
      return diagram.getElements().stream()
         .filter(el -> el.getSemanticElement().getElementId().equals(semanticUri)).findFirst();
   }
}
