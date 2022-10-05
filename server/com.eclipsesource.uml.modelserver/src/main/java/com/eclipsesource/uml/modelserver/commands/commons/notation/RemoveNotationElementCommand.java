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

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import org.eclipse.glsp.server.emf.model.notation.NotationElement;

public class RemoveNotationElementCommand extends UmlNotationElementCommand {

   protected final NotationElement element;

   public RemoveNotationElementCommand(final EditingDomain domain, final URI modelUri, final String nodeUri) {
      super(domain, modelUri);
      element = UmlNotationCommandUtil.getNotationElement(modelUri, domain, nodeUri);
   }

   @Override
   protected void doExecute() {
      if (element != null) {
         umlDiagram.getElements().remove(element);
      }
   }
}
