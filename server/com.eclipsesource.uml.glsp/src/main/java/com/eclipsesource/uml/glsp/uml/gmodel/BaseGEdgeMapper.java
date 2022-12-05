/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.gmodel;

import java.util.ArrayList;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.model.notation.Edge;

public abstract class BaseGEdgeMapper<Source extends EObject, Target extends GEdge>
   extends BaseGModelMapper<Source, Target> {

   protected void applyEdgeNotation(final Source source, final GEdgeBuilder builder) {
      modelState.getIndex().getNotation(source, Edge.class).ifPresent(edge -> {
         if (edge.getBendPoints() != null) {
            ArrayList<GPoint> bendPoints = new ArrayList<>();
            edge.getBendPoints().forEach(p -> bendPoints.add(GraphUtil.copy(p)));
            builder.addRoutingPoints(bendPoints);
         }
      });
   }
}
