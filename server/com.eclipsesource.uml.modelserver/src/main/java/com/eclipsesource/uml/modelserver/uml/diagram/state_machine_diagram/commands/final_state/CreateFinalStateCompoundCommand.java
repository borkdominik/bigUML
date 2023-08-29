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

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Region;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddShapeNotationCommand;

public class CreateFinalStateCompoundCommand extends CompoundCommand {

   public CreateFinalStateCompoundCommand(final ModelContext context, final Region parent,
      final GPoint position) {
      var command = new CreateFinalStateSemanticCommand(context, parent);

      this.append(command);
      this.append(
         new AddShapeNotationCommand(context, command::getSemanticElement, position, GraphUtil.dimension(30, 30)));
   }
}
