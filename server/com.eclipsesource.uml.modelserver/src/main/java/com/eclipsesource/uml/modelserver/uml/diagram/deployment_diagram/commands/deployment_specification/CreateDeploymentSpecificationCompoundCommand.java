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
package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.deployment_specification;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.Device;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.ExecutionEnvironment;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.Node;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddShapeNotationCommand;

public final class CreateDeploymentSpecificationCompoundCommand extends CompoundCommand {

   public CreateDeploymentSpecificationCompoundCommand(final ModelContext context, final Element parent,
      final GPoint position) {

      // Create Deployment Spec in Artifact
      try {

         var command = new CreateDeploymentSpecificationArtifactSemanticCommand(context, (Artifact) parent);

         this.append(command);
         this.append(
            new AddShapeNotationCommand(context, command::getSemanticElement, position, GraphUtil.dimension(160, 50)));

      } catch (Exception e) {

         // Create Deployment Spec in Device
         try {

            var command = new CreateDeploymentSpecificationDeviceSemanticCommand(context, (Device) parent);

            this.append(command);
            this.append(
               new AddShapeNotationCommand(context, command::getSemanticElement, position,
                  GraphUtil.dimension(160, 50)));

         } catch (Exception e2) {

            // Create Deployment Spec in Package
            try {

               var command = new CreateDeploymentSpecificationPackageSemanticCommand(context, (Package) parent);

               this.append(command);
               this.append(
                  new AddShapeNotationCommand(context, command::getSemanticElement, position,
                     GraphUtil.dimension(160, 50)));

            } catch (Exception e3) {

               // Create Deployment Spec in Exec Env
               try {
                  var command = new CreateDeploymentSpecificationExecutionEnvironmentSemanticCommand(context,
                     (ExecutionEnvironment) parent);

                  this.append(command);
                  this.append(
                     new AddShapeNotationCommand(context, command::getSemanticElement, position,
                        GraphUtil.dimension(160, 50)));

               } catch (Exception e4) {

                  // Create Deployment Spec in Node
                  try {
                     var command = new CreateDeploymentSpecificationNodeSemanticCommand(context, (Node) parent);

                     this.append(command);
                     this.append(
                        new AddShapeNotationCommand(context, command::getSemanticElement, position,
                           GraphUtil.dimension(160, 50)));

                     // Create Deployment Spec in Model
                  } catch (Exception e5) {

                     var command = new CreateDeploymentSpecificationSemanticCommand(context, (Model) parent);
                     this.append(command);
                     this.append(
                        new AddShapeNotationCommand(context, command::getSemanticElement, position,
                           GraphUtil.dimension(160, 50)));

                  }
               }
            }
         }
      }
   }
}
