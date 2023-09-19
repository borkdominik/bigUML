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
package com.eclipsesource.uml.glsp.uml.elements.activity_node.gmodel.object_nodes;

import java.util.ArrayList;
import java.util.List;

import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.ActivityParameterNode;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.elements.activity_node.ActivityNodeConfiguration;
import com.eclipsesource.uml.glsp.uml.gmodel.RepresentationGNodeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.NamedElementGBuilder;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ActivityParameterMapper extends RepresentationGNodeMapper<ActivityParameterNode, GNode>
   implements NamedElementGBuilder<ActivityParameterNode> {

   @Inject
   public ActivityParameterMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public GNode map(final ActivityParameterNode source) {
      var builder = new GNodeBuilder(configuration(ActivityNodeConfiguration.class).activityParameterNodeTypeId())
         .id(idGenerator.getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .addCssClass(CoreCSS.NODE)
         .addCssClass(CoreCSS.NODE_CONTAINER);

      applyShapeNotation(source, builder);

      return builder.build();
   }

   @Override
   public List<GModelElement> mapSiblings(final ActivityParameterNode source) {
      var siblings = new ArrayList<GModelElement>();
      siblings.addAll(mapHandler.handle(source.getOutgoings()));
      return siblings;
   }
}
