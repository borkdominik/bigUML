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
package com.eclipsesource.uml.modelserver.uml.elements.artifact;

import java.util.Collection;
import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.Element;
import org.eclipse.uml2.uml.Node;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddShapeNotationCommand;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticChildCommand;
import com.eclipsesource.uml.modelserver.uml.command.provider.element.NodeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.artifact.commands.CreateNestedArtifactSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.artifact.commands.UpdateArtifactArgument;
import com.eclipsesource.uml.modelserver.uml.elements.artifact.commands.UpdateArtifactSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.class_.commands.AddNestedClassifierSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.packageable_element.AddPackagedElementCommand;

public class ArtifactCommandProvider extends NodeCommandProvider<Artifact, Element> {

   @Override
   protected Collection<Command> createModifications(final ModelContext context, final Element parent,
      final GPoint position) {
      BaseCreateSemanticChildCommand<?, ?> semantic = null;
      if (parent instanceof Package) {
         semantic = new AddPackagedElementCommand(context, (Package) parent, UMLFactory.eINSTANCE::createArtifact);
      } else if (parent instanceof Node) {
         semantic = new AddNestedClassifierSemanticCommand(context, (Node) parent,
            UMLFactory.eINSTANCE::createArtifact);
      } else if (parent instanceof Artifact) {
         semantic = new CreateNestedArtifactSemanticCommand(context, (Artifact) parent);
      } else {
         throw new IllegalArgumentException(String.format("Parent %s can not be handled", parent.getClass().getName()));
      }

      var notation = new AddShapeNotationCommand(
         context, semantic::getSemanticElement, position, GraphUtil.dimension(160, 50));
      return List.of(semantic, notation);
   }

   @Override
   protected Collection<Command> updateModifications(final ModelContext context, final Artifact element) {
      var decoder = new ContributionDecoder(context);
      var update = decoder.embedJson(UpdateArtifactArgument.class);
      return List.of(new UpdateArtifactSemanticCommand(context, element, update));
   }

}
