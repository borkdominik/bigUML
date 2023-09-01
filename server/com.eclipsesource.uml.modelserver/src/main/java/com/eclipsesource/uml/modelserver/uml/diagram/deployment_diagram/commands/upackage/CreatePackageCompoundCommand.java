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
package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.upackage;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddShapeNotationCommand;

public final class CreatePackageCompoundCommand extends CompoundCommand {

   public CreatePackageCompoundCommand(final ModelContext context, final Element parent,
      final GPoint position) {

      // Create Package in Package
      try {

         var command = new CreatePackagePackageSemanticCommand(context, (Package) parent);

         this.append(command);
         this.append(
            new AddShapeNotationCommand(context, command::getSemanticElement, position, GraphUtil.dimension(160, 50)));

         // Create Package in Model
      } catch (Exception e) {
         var command = new CreatePackageSemanticCommand(context, (Model) parent);
         this.append(command);
         this.append(
            new AddShapeNotationCommand(context, command::getSemanticElement, position,
               GraphUtil.dimension(160, 50)));
      }

   }
}
