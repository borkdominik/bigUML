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
package com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.gmodel;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Artifact;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Artifact;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;

public final class ArtifactNodeMapper extends BaseGNodeMapper<Artifact, GNode>
   implements NamedElementGBuilder<Artifact> {

   @Override
   public GNode map(final Artifact source) {
      var builder = new GNodeBuilder(UmlDeployment_Artifact.typeId());

      builder.id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CoreCSS.NODE)
         .add(buildHeader(source))
         .add(buildCompartment1(source))
         .add(buildCompartment2(source));

      applyShapeNotation(source, builder);

      return builder.build();
   }

   @Override
   public List<GModelElement> mapSiblings(final Artifact source) {
      var siblings = new ArrayList<GModelElement>();

      siblings.addAll(mapHandler.handle(source.getGeneralizations()));
      siblings.addAll(mapHandler.handle(source.getSubstitutions()));
      siblings.addAll(mapHandler.handle(source.getManifestations()));

      return siblings;
   }

   protected GCompartment buildHeader(final Artifact source) {
      var header = compartmentHeaderBuilder(source)
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(new GLayoutOptions().hAlign(GConstants.HAlign.CENTER));

      if (source.isAbstract()) {
         header.add(textBuilder(source, "<<Artifact>>").build());
      }

      header.add(buildIconVisibilityName(source, "--uml-artifact-icon"));

      return header.build();
   }

   protected GCompartment buildCompartment2(final Artifact source) {
      return freeformChildrenCompartmentBuilder(source)
         .addAll(source.getNestedArtifacts().stream()
            .map(mapHandler::handle)
            .collect(Collectors.toList()))
         .addAll(source.getNestedArtifacts().stream()
            .map(mapHandler::handleSiblings)
            .flatMap(Collection::stream)
            .collect(Collectors.toList()))
         .build();
   }

   protected GCompartment buildCompartment1(final Artifact source) {
      var compartment = fixedChildrenCompartmentBuilder(source);

      var propertyElements = source.getOwnedAttributes().stream()
         .filter(p -> p.getAssociation() == null)
         .map(mapHandler::handle)
         .collect(Collectors.toList());
      compartment.addAll(propertyElements);

      var operationElements = source.getOwnedOperations().stream()
         .map(mapHandler::handle)
         .collect(Collectors.toList());
      compartment.addAll(operationElements);

      return compartment.build();
   }
}
