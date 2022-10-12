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

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.server.emf.model.notation.NotationElement;

import com.eclipsesource.uml.modelserver.diagram.base.notation.UmlNotationCommand;
import com.eclipsesource.uml.modelserver.diagram.util.UmlNotationCommandUtil;

public class RemoveNotationElementCommand extends UmlNotationCommand {

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
