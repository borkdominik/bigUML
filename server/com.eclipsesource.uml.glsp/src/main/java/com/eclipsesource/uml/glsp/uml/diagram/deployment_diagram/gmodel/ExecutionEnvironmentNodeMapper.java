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
import org.eclipse.uml2.uml.ExecutionEnvironment;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_ExecutionEnvironment;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;

public class ExecutionEnvironmentNodeMapper extends BaseGNodeMapper<ExecutionEnvironment, GNode>
   implements NamedElementGBuilder<ExecutionEnvironment> {

   @Override
   public GNode map(final ExecutionEnvironment source) {
      var builder = new GNodeBuilder(UmlDeployment_ExecutionEnvironment.typeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CoreCSS.NODE)
         .add(buildHeader(source))
         .add(buildCompartment2(source))
         .add(buildCompartment3(source));

      applyShapeNotation(source, builder);

      return builder.build();
   }

   @Override
   public List<GModelElement> mapSiblings(final ExecutionEnvironment source) {
      var siblings = new ArrayList<GModelElement>();

      siblings.addAll(mapHandler.handle(source.getGeneralizations()));

      return siblings;
   }

   protected GCompartment buildHeader(final ExecutionEnvironment source) {
      var header = compartmentHeaderBuilder(source)
         .layout(GConstants.Layout.VBOX);

      if (source.isAbstract()) {
         header.add(textBuilder(source, "<<Execution Environment>>").build());
      }
      header.add(buildIconVisibilityName(source, "--uml-execution-environment-icon"));

      return header.build();
   }

   protected GCompartment buildCompartment2(final ExecutionEnvironment source) {
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

   protected GCompartment buildCompartment3(final ExecutionEnvironment source) {
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
}
