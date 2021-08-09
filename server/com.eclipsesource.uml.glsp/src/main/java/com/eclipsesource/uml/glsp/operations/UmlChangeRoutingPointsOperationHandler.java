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
package com.eclipsesource.uml.glsp.operations;

import java.util.HashMap;
import java.util.Map;

import org.eclipse.glsp.server.model.GModelState;
import org.eclipse.glsp.server.operations.ChangeRoutingPointsOperation;
import org.eclipse.glsp.server.types.ElementAndRoutingPoints;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.modelserver.unotation.Edge;

public class UmlChangeRoutingPointsOperationHandler
   extends ModelServerAwareBasicOperationHandler<ChangeRoutingPointsOperation> {

   @Override
   public void executeOperation(final ChangeRoutingPointsOperation operation, final GModelState graphicalModelState,
      final UmlModelServerAccess modelServerAccess) throws Exception {
      UmlModelState modelState = UmlModelState.getModelState(graphicalModelState);
      Map<Edge, ElementAndRoutingPoints> changeRoutingPointsMap = new HashMap<>();
      for (ElementAndRoutingPoints element : operation.getNewRoutingPoints()) {
         modelState.getIndex().getNotation(element.getElementId(), Edge.class)
            .ifPresent(notationElement -> {
               changeRoutingPointsMap.put(notationElement, element);
            });
      }
      modelServerAccess.changeRoutingPoints(changeRoutingPointsMap);
   }

   @Override
   public String getLabel() { return "Reroute uml edge"; }
}
