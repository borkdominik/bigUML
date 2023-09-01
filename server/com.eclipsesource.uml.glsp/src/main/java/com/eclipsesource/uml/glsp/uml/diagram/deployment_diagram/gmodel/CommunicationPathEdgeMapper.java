/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.gmodel;

import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.CommunicationPath;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.constants.CoreTypes;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.NameLabelSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.deployment_diagram.diagram.UmlDeployment_CommunicationPath;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGEdgeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.EdgeGBuilder;

public final class CommunicationPathEdgeMapper extends BaseGEdgeMapper<CommunicationPath, GEdge>
   implements EdgeGBuilder {

   @Override
   public GEdge map(final CommunicationPath source) {
      var memberEnds = source.getMemberEnds();
      var memberEndFirst = memberEnds.get(0);
      var memberEndSecond = memberEnds.get(1);

      var builder = new GEdgeBuilder(UmlDeployment_CommunicationPath.typeId())
         .id(idGenerator.getOrCreateId(source))
         .addCssClass(CoreCSS.EDGE)
         .routerKind(GConstants.RouterKind.POLYLINE)
         .sourceId(idGenerator.getOrCreateId(memberEndFirst.getOwner()))
         .targetId(idGenerator.getOrCreateId(memberEndSecond.getOwner()));

      var nameLabel = createNameLabel(source.getName(),
         suffix.appendTo(NameLabelSuffix.SUFFIX, idGenerator.getOrCreateId(source)), 0.6d);
      builder.add(nameLabel);

      // applyMemberEnds(source, builder); TODO whatever
      applyEdgeNotation(source, builder);

      return builder.build();
   }

   protected GLabel createNameLabel(final String name, final String id, final Double position) {
      var type = CoreTypes.LABEL_NAME;
      var side = GConstants.EdgeSide.TOP;
      return new GLabelBuilder(type)
         .edgePlacement(new GEdgePlacementBuilder().side(side).position(position).rotate(false).build())
         .id(id)
         .text(name)
         .build();
   }

}
