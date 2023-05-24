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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.gmodel;

import java.util.List;

import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.builder.impl.GArguments;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.InterfaceRealization;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_InterfaceRealization;
import com.eclipsesource.uml.glsp.uml.gmodel.BaseGEdgeMapper;
import com.eclipsesource.uml.glsp.uml.gmodel.element.EdgeGBuilder;

public final class InterfaceRealizationEdgeMapper extends BaseGEdgeMapper<InterfaceRealization, GEdge>
   implements EdgeGBuilder {

   @Override
   public GEdge map(final InterfaceRealization source) {
      var classifier = source.getImplementingClassifier();
      var classifierId = idGenerator.getOrCreateId(classifier);
      var contract = source.getContract();
      var contractId = idGenerator.getOrCreateId(contract);

      GEdgeBuilder builder = new GEdgeBuilder(UmlClass_InterfaceRealization.typeId())
         .id(idGenerator.getOrCreateId(source))
         .addCssClasses(List.of(CoreCSS.EDGE, CoreCSS.EDGE_DASHED))
         .addCssClass(CoreCSS.Marker.TRIANGLE_EMPTY.end())
         .sourceId(classifierId)
         .targetId(contractId)
         .addArgument(GArguments.edgePadding(10));

      applyEdgeNotation(source, builder);

      return builder.build();
   }
}
