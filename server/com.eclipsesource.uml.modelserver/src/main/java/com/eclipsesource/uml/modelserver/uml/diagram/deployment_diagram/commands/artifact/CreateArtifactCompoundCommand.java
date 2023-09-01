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
package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.artifact;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.ExecutionEnvironment;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.Node;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddShapeNotationCommand;

public final class CreateArtifactCompoundCommand extends CompoundCommand {

   public CreateArtifactCompoundCommand(final ModelContext context, final Element parent,
      final GPoint position) {

      // Create Artifact in Artifact
      try {

         var command = new CreateArtifactSemanticCommand(context, (Artifact) parent);

         this.append(command);
         this.append(
            new AddShapeNotationCommand(context, command::getSemanticElement, position, GraphUtil.dimension(160, 50)));

      } catch (Exception e) {

         // create Artifact in Execution Environment
         try {

            var command = new CreateArtifactExecutionEnvironmentSemanticCommand(context,
               (ExecutionEnvironment) parent);

            this.append(command);
            this.append(
               new AddShapeNotationCommand(context, command::getSemanticElement, position,
                  GraphUtil.dimension(160, 50)));

         } catch (Exception e2) {

            // Create Artifact in Package
            try {

               var command = new CreateArtifactPackageSemanticCommand(context,
                  (Package) parent);

               this.append(command);
               this.append(
                  new AddShapeNotationCommand(context, command::getSemanticElement, position,
                     GraphUtil.dimension(160, 50)));

            } catch (Exception e3) {

               // Create Artifact in Node
               try {
                  var command = new CreateArtifactNodeSemanticCommand(context,
                     (Node) parent);

                  this.append(command);
                  this.append(
                     new AddShapeNotationCommand(context, command::getSemanticElement, position,
                        GraphUtil.dimension(160, 50)));

                  // Create Artifact in Model
               } catch (Exception e4) {
                  var command = new CreateBaseArtifactSemanticCommand(context, (Model) parent);
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
