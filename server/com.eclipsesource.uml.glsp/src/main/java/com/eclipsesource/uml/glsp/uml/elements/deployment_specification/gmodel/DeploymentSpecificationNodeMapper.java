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
package com.eclipsesource.uml.glsp.uml.elements.deployment_specification.gmodel;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.DeploymentSpecification;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.elements.classifier.GClassifierBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.RepresentationGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class DeploymentSpecificationNodeMapper extends RepresentationGNodeMapper<DeploymentSpecification, GNode>
   implements NamedElementGBuilder<DeploymentSpecification> {

   @Inject
   public DeploymentSpecificationNodeMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public GNode map(final DeploymentSpecification source) {
      var builder = new GNodeBuilder(configuration().typeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CoreCSS.NODE)
         .add(buildHeader(source))
         .add(buildCompartment(source));

      applyShapeNotation(source, builder);

      return builder.build();
   }

   @Override
   public List<GModelElement> mapSiblings(final DeploymentSpecification source) {
      var siblings = new ArrayList<GModelElement>();

      siblings.addAll(mapHandler.handle(source.getGeneralizations()));
      siblings.addAll(mapHandler.handle(source.getManifestations()));

      return siblings;
   }

   protected GCompartment buildHeader(final DeploymentSpecification source) {
      var header = compartmentHeaderBuilder(source)
         .layout(GConstants.Layout.VBOX);

      if (source.isAbstract()) {
         header.add(textBuilder(source, "<<Deployment Specification>>").build());
      }
      header.add(buildIconVisibilityName(source, "--uml-deployment-specification-icon"));

      return header.build();
   }

   protected GCompartment buildCompartment(final DeploymentSpecification source) {
      var compartment = fixedChildrenCompartmentBuilder(source);

      var classifier = new GClassifierBuilder<>(source, this);
      var attributes = classifier.listAttributes();
      var operations = classifier.listOperations();

      compartment
         .addAll(attributes)
         .addAll(operations);

      return compartment.build();
   }

   protected GCompartment buildCompartment2(final DeploymentSpecification source) {
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
}
