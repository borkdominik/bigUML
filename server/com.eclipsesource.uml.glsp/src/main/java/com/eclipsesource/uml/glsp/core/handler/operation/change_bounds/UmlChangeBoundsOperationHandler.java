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
package com.eclipsesource.uml.glsp.core.handler.operation.change_bounds;

import java.util.HashMap;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSOperationHandler;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.glsp.server.operations.ChangeBoundsOperation;
import org.eclipse.glsp.server.types.ElementAndBounds;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.modelserver.core.commands.change_bounds.UmlChangeBoundsContribution;
import com.google.inject.Inject;

public class UmlChangeBoundsOperationHandler extends EMSOperationHandler<ChangeBoundsOperation> {

   @Inject
   protected UmlModelState modelState;
   @Inject
   protected UmlModelServerAccess modelServerAccess;

   @Override
   public void executeOperation(final ChangeBoundsOperation operation) {
      var representation = modelState.getUnsafeRepresentation();
      var changeBoundsMap = new HashMap<Shape, ElementAndBounds>();

      for (ElementAndBounds element : operation.getNewBounds()) {
         modelState.getIndex().getNotation(element.getElementId(), Shape.class)
            .ifPresent(shape -> {
               changeBoundsMap.put(shape, element);
            });
      }

      modelServerAccess.exec(UmlChangeBoundsContribution.create(representation, changeBoundsMap))
         .thenAccept(response -> {
            if (response.body() == null || response.body().isEmpty()) {
               throw new GLSPServerException("Could not change bounds: " + changeBoundsMap.toString());
            }
         });
   }

   @Override
   public String getLabel() { return "Uml: Change bounds"; }

}
