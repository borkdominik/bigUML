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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.upackage;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlAddShapeCommand;

public class AddPackageCompoundCommand extends CompoundCommand {

   public AddPackageCompoundCommand(final ModelContext context, final Package parent, final GPoint position) {
      var command = new AddPackageSemanticCommand(context, parent);

      this.append(command);
      this.append(new UmlAddShapeCommand(context, command::getSemanticElement, position, GraphUtil.dimension(160, 50)));
   }
}