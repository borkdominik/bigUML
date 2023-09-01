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
package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.node;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Device;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.Node;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddShapeNotationCommand;

public final class CreateNodeCompoundCommand extends CompoundCommand {

   public CreateNodeCompoundCommand(final ModelContext context, final Element parent,
      final GPoint position) {
      // create Node in Node
      try {
         var command = new CreateNodeNodeSemanticCommand(context, (Node) parent);

         this.append(command);
         this.append(
            new AddShapeNotationCommand(context, command::getSemanticElement, position, GraphUtil.dimension(160, 50)));

      } catch (Exception e) {

         // create Node in Package
         try {

            var command = new CreateNodePackageSemanticCommand(context, (Package) parent);

            this.append(command);
            this.append(
               new AddShapeNotationCommand(context, command::getSemanticElement, position,
                  GraphUtil.dimension(160, 50)));

         } catch (Exception e2) {

            // create Node in Device
            try {
               var command = new CreateNodeDeviceSemanticCommand(context, (Device) parent);

               this.append(command);
               this.append(
                  new AddShapeNotationCommand(context, command::getSemanticElement, position,
                     GraphUtil.dimension(160, 50)));

               // create Node in Model
            } catch (Exception e4) {
               var command = new CreateNodeSemanticCommand(context, (Model) parent);
               this.append(command);
               this.append(
                  new AddShapeNotationCommand(context, command::getSemanticElement, position,
                     GraphUtil.dimension(160, 50)));
            }
         }
      }
   }
}
