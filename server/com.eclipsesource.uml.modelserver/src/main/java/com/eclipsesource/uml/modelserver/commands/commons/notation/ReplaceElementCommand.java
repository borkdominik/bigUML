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
package com.eclipsesource.uml.modelserver.commands.commons.notation;

import java.util.Optional;
import java.util.function.Supplier;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.modelserver.unotation.NotationElement;
import com.eclipsesource.uml.modelserver.unotation.SemanticProxy;
import com.eclipsesource.uml.modelserver.unotation.UnotationFactory;

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
         .filter(s -> oldUri.equals(s.getSemanticElement().getUri()))
         .findAny();
      if (notationElem.isPresent()) {
         SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
         String uri = EcoreUtil.getURI(elementSupplier.get()).fragment();
         proxy.setUri(uri);
         notationElem.get().setSemanticElement(proxy);
      }
   }

}
