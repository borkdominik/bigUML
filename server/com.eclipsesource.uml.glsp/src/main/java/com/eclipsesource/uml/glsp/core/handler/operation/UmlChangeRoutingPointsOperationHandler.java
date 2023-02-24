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
package com.eclipsesource.uml.glsp.core.handler.operation;

import java.util.HashMap;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSOperationHandler;
import org.eclipse.glsp.server.emf.model.notation.Edge;
import org.eclipse.glsp.server.operations.ChangeRoutingPointsOperation;
import org.eclipse.glsp.server.types.ElementAndRoutingPoints;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.modelserver.core.commands.change_routing_points.UmlChangeRoutingPointsContribution;
import com.google.inject.Inject;

public class UmlChangeRoutingPointsOperationHandler extends EMSOperationHandler<ChangeRoutingPointsOperation> {

   @Inject
   protected UmlModelState modelState;
   @Inject
   protected UmlModelServerAccess modelServerAccess;

   @Override
   public void executeOperation(final ChangeRoutingPointsOperation operation) {

      var changeRoutingPointsMap = new HashMap<Edge, ElementAndRoutingPoints>();

      for (ElementAndRoutingPoints element : operation.getNewRoutingPoints()) {
         modelState.getIndex().getNotation(element.getElementId(), Edge.class)
            .ifPresent(notationElement -> {
               changeRoutingPointsMap.put(notationElement, element);
            });
      }

      modelServerAccess.exec(UmlChangeRoutingPointsContribution.create(changeRoutingPointsMap)).thenAccept(response -> {
         if (response.body() == null || response.body().isEmpty()) {
            throw new GLSPServerException("Could not change routing points: " + changeRoutingPointsMap.toString());
         }
      });
   }

   @Override
   public String getLabel() { return "Uml: Change routing points"; }

}
