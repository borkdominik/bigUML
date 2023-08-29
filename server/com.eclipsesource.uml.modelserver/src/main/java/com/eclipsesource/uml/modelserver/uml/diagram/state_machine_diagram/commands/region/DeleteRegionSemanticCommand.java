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
package com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.region;

import org.eclipse.uml2.uml.Region;
import org.eclipse.uml2.uml.StateMachine;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public class DeleteRegionSemanticCommand extends BaseDeleteSemanticChildCommand<StateMachine, Region> {

   public DeleteRegionSemanticCommand(final ModelContext context,
      final Region semanticElement) {
      super(context, semanticElement.containingStateMachine(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final StateMachine parent, final Region child) {
      parent.getRegions().remove(child);
   }
}
