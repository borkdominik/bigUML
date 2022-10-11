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
package com.eclipsesource.uml.modelserver.old.diagram.common.notation;

import java.util.Optional;
import java.util.function.Supplier;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.modelserver.diagram.commons.notation.UmlNotationElementCommand;

import org.eclipse.glsp.server.emf.model.notation.NotationElement;
import org.eclipse.glsp.server.emf.model.notation.NotationFactory;

public class ReplaceElementCommand extends UmlNotationElementCommand {

   protected String oldUri;
   protected Supplier<? extends Element> elementSupplier;

   public ReplaceElementCommand(final EditingDomain domain, final URI modelUri, final String oldUri,
      final Supplier<? extends Element> elementSupplier) {
      super(domain, modelUri);
      this.oldUri = oldUri;
      this.elementSupplier = elementSupplier;
   }

   @Override
   protected void doExecute() {

      Optional<NotationElement> notationElem = umlDiagram.getElements().stream()
         .filter(s -> oldUri.equals(s.getSemanticElement().getElementId()))
         .findAny();
      if (notationElem.isPresent()) {
         var proxy = NotationFactory.eINSTANCE.createSemanticElementReference();
         String uri = EcoreUtil.getURI(elementSupplier.get()).fragment();
         proxy.setElementId(uri);
         notationElem.get().setSemanticElement(proxy);
      }
   }

}
