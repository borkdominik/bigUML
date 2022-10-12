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
package com.eclipsesource.uml.modelserver.uml.notation.commands;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.server.emf.model.notation.NotationElement;
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.modelserver.uml.extension.SemanticElementAccessor;
import com.eclipsesource.uml.modelserver.uml.notation.UmlNotationElementCommand;

public class UmlRemoveNotationElementCommand extends UmlNotationElementCommand {

   protected final NotationElement shapeToRemove;

   public UmlRemoveNotationElementCommand(final EditingDomain domain, final URI modelUri,
      final String semanticElementId) {
      super(domain, modelUri);
      this.shapeToRemove = notationElementAccessor.getElement(semanticElementId,
         NotationElement.class);
   }

   public UmlRemoveNotationElementCommand(final EditingDomain domain, final URI modelUri,
      final Element element) {
      super(domain, modelUri);
      var semanticElementId = SemanticElementAccessor.getId(element);

      this.shapeToRemove = notationElementAccessor.getElement(semanticElementId,
         NotationElement.class);
   }

   @Override
   protected void doExecute() {
      diagram.getElements().remove(shapeToRemove);
   }

}
