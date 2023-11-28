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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.shared.notation;

import org.eclipse.glsp.server.emf.model.notation.NotationElement;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public class SDDeleteNotationElementCommand
   extends SDBaseNotationExistenceCheckedCommand<NotationElement, NotationElement> {

   public SDDeleteNotationElementCommand(final ModelContext context,
      final NotationElement semanticElement) {
      super(context, semanticElement);
   }

   @Override
   protected void doChanges(final NotationElement notationElement) {
      diagram.getElements().remove(notationElement);
   }

}
