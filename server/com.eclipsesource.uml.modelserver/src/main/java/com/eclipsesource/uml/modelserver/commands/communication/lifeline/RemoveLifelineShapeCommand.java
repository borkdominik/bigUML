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
package com.eclipsesource.uml.modelserver.commands.communication.lifeline;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.unotation.Shape;

public class RemoveLifelineShapeCommand extends UmlNotationElementCommand {

   protected final Shape shapeToRemove;

   public RemoveLifelineShapeCommand(final EditingDomain domain, final URI modelUri, final String semanticProxyUri) {
      super(domain, modelUri);
      this.shapeToRemove = UmlNotationCommandUtil.getNotationElement(modelUri, domain, semanticProxyUri, Shape.class);
   }

   @Override
   protected void doExecute() {
      umlDiagram.getElements().remove(shapeToRemove);
   }
}
