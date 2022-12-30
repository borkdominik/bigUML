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
package com.eclipsesource.uml.modelserver.core.commands.change_routing_points;

import java.util.List;

import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.server.emf.model.notation.Edge;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.BaseNotationElementCommand;

public class UmlChangeRoutingPointsNotationCommand extends BaseNotationElementCommand {

   protected final Edge edge;
   protected final List<GPoint> newRoutingPoints;

   public UmlChangeRoutingPointsNotationCommand(final ModelContext context,
      final Edge edge, final List<GPoint> newRoutingPoints) {
      super(context);
      this.newRoutingPoints = newRoutingPoints;
      this.edge = edge;
   }

   @Override
   protected void doExecute() {
      edge.getBendPoints().clear();
      edge.getBendPoints().addAll(newRoutingPoints);
   }
}
