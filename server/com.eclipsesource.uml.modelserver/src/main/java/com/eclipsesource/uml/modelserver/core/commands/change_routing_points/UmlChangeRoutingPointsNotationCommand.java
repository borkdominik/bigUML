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

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.server.emf.model.notation.Edge;

import com.eclipsesource.uml.modelserver.shared.notation.UmlNotationElementCommand;

public class UmlChangeRoutingPointsNotationCommand extends UmlNotationElementCommand {

   protected final Edge edge;
   protected final List<GPoint> newRoutingPoints;

   public UmlChangeRoutingPointsNotationCommand(final EditingDomain domain, final URI modelUri,
      final Edge edge, final List<GPoint> newRoutingPoints) {
      super(domain, modelUri);
      this.newRoutingPoints = newRoutingPoints;
      this.edge = edge;
   }

   @Override
   protected void doExecute() {
      edge.getBendPoints().clear();
      edge.getBendPoints().addAll(newRoutingPoints);
   }
}
