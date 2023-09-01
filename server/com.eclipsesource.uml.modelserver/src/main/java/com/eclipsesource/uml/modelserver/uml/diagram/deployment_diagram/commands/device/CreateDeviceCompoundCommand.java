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
package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.device;

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

public final class CreateDeviceCompoundCommand extends CompoundCommand {

   public CreateDeviceCompoundCommand(final ModelContext context, final Element parent,
      final GPoint position) {

      // Create Device in Device
      try {

         var command = new CreateDeviceDeviceSemanticCommand(context, (Device) parent);

         this.append(command);
         this.append(
            new AddShapeNotationCommand(context, command::getSemanticElement, position, GraphUtil.dimension(160, 50)));

      } catch (Exception e) {

         // Create Device in Package
         try {

            var command = new CreateDevicePackageSemanticCommand(context, (Package) parent);

            this.append(command);
            this.append(
               new AddShapeNotationCommand(context, command::getSemanticElement, position,
                  GraphUtil.dimension(160, 50)));

            // Create Device in Node
         } catch (Exception e2) {

            try {
               var command = new CreateDeviceNodeSemanticCommand(context, (Node) parent);

               this.append(command);
               this.append(
                  new AddShapeNotationCommand(context, command::getSemanticElement, position,
                     GraphUtil.dimension(160, 50)));

               // Create Device in Model
            } catch (Exception e3) {

               var command = new CreateDeviceSemanticCommand(context, (Model) parent);
               this.append(command);
               this.append(
                  new AddShapeNotationCommand(context, command::getSemanticElement, position,
                     GraphUtil.dimension(160, 50)));
            }

         }
      }
   }
}
