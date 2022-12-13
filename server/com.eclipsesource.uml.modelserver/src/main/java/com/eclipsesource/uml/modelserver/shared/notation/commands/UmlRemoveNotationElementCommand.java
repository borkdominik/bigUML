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
package com.eclipsesource.uml.modelserver.shared.notation.commands;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.server.emf.model.notation.NotationElement;
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.modelserver.shared.notation.NotationExistenceCheckedCommand;

public class UmlRemoveNotationElementCommand extends NotationExistenceCheckedCommand<Element, NotationElement> {

   public UmlRemoveNotationElementCommand(final EditingDomain domain, final URI modelUri,
      final Element semanticElement) {
      super(domain, modelUri, semanticElement);

   }

   @Override
   protected void doChanges(final NotationElement notationElement) {
      diagram.getElements().remove(notationElement);
   }

}
