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
package com.eclipsesource.uml.modelserver.uml.diagram.state_machine_diagram.commands.pseudostate;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.PseudostateKind;
import org.eclipse.uml2.uml.Region;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddShapeNotationCommand;

public class CreatePseudoStateCompoundCommand extends CompoundCommand {

   public CreatePseudoStateCompoundCommand(final ModelContext context, final Region parent,
      final GPoint position, final PseudostateKind kind) {
      var command = new CreatePseudoStateSemanticCommand(context, parent, kind);

      this.append(command);
      this.append(
         new AddShapeNotationCommand(context, command::getSemanticElement, position, GraphUtil.dimension(30, 30)));
   }
}
