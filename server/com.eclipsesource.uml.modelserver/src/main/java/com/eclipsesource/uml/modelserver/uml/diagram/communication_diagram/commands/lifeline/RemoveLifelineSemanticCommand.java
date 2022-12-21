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
package com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.lifeline;

import org.eclipse.uml2.uml.Lifeline;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.SemanticExistenceCheckedCommand;

public class RemoveLifelineSemanticCommand extends SemanticExistenceCheckedCommand<Lifeline> {

   public RemoveLifelineSemanticCommand(final ModelContext context,
      final Lifeline lifeline) {
      super(context, lifeline);
   }

   @Override
   protected void doChanges(final Lifeline semanticElement) {
      var interaction = semanticElement.getInteraction();
      interaction.getLifelines().remove(semanticElement);
   }

}
