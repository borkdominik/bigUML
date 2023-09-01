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
import org.eclipse.uml2.uml.Dependency;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_Model;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;

public class ModelNodeMapper extends BaseGNodeMapper<Model, GNode>
   implements NamedElementGBuilder<Model> {

   @Override
   public GNode map(final Model source) {
      var builder = new GNodeBuilder(UmlDeployment_Model.typeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CoreCSS.NODE)
         .add(buildHeader(source))
         .add(buildCompartment2(source));

      applyShapeNotation(source, builder);

      return builder.build();
   }

   @Override
   public List<GModelElement> mapSiblings(final Model source) {
      var siblings = new ArrayList<GModelElement>();

      siblings.addAll(mapHandler.handle(source.getClientDependencies()));

      return siblings;
   }

   protected GCompartment buildHeader(final Model source) {
      var header = compartmentHeaderBuilder(source)
         .layout(GConstants.Layout.VBOX);

      header.add(textBuilder(source, "Model").build());
      header.add(buildIconVisibilityName(source, "--uml-model-icon"));

      return header.build();
   }

   protected GCompartment buildCompartment2(final Model source) {
      return freeformChildrenCompartmentBuilder(source)
         .addAll(source.getPackagedElements().stream()
            .filter(element -> !(element instanceof Dependency))
            .map(mapHandler::handle)
            .collect(Collectors.toList()))
         .addAll(source.getPackagedElements().stream()
            .filter(element -> !(element instanceof Dependency))
            .map(mapHandler::handleSiblings)
            .flatMap(Collection::stream)
            .collect(Collectors.toList()))
         .build();
   }
}
