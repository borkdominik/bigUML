/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.final_state;

import org.eclipse.uml2.uml.FinalState;
import org.eclipse.uml2.uml.Region;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public class DeleteFinalStateSemanticCommand extends BaseDeleteSemanticChildCommand<Region, FinalState> {

   public DeleteFinalStateSemanticCommand(final ModelContext context, final FinalState semanticElement) {
      super(context, semanticElement.getContainer(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Region parent, final FinalState child) {
      parent.getSubvertices().remove(child);
   }
}
