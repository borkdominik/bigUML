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
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Device;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Device;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;

public class DeviceNodeMapper extends BaseGNodeMapper<Device, GNode>
   implements NamedElementGBuilder<Device> {

   @Override
   public GNode map(final Device source) {
      var builder = new GNodeBuilder(UmlDeployment_Device.typeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CoreCSS.NODE)
         .add(buildHeader(source))
         .add(buildCompartment(source))
         .add(buildCompartment2(source))
         .add(buildCompartment3(source));

      applyShapeNotation(source, builder);

      return builder.build();
   }

   @Override
   public List<GModelElement> mapSiblings(final Device source) {
      var siblings = new ArrayList<GModelElement>();

      siblings.addAll(mapHandler.handle(source.getGeneralizations()));

      return siblings;
   }

   protected GCompartment buildHeader(final Device source) {
      var header = compartmentHeaderBuilder(source)
         .layout(GConstants.Layout.VBOX);

      if (source.isAbstract()) {
         header.add(textBuilder(source, "<<Device>>").build());
      }

      header.add(buildIconVisibilityName(source, "--uml-device-icon"));

      return header.build();
   }

   protected GCompartment buildCompartment(final Device source) {
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

   protected GCompartment buildCompartment2(final Device source) {
      return freeformChildrenCompartmentBuilder(source)
         .addAll(source.getNestedNodes().stream()
            .map(mapHandler::handle)
            .collect(Collectors.toList()))
         .addAll(source.getNestedNodes().stream()
            .map(mapHandler::handleSiblings)
            .flatMap(Collection::stream)
            .collect(Collectors.toList()))
         .build();
   }

   protected GCompartment buildCompartment3(final Device source) {
      return freeformChildrenCompartmentBuilder(source)
         .addAll(source.getNestedClassifiers().stream()
            .map(mapHandler::handle)
            .collect(Collectors.toList()))
         .addAll(source.getNestedClassifiers().stream()
            .map(mapHandler::handleSiblings)
            .flatMap(Collection::stream)
            .collect(Collectors.toList()))
         .build();
   }

}
