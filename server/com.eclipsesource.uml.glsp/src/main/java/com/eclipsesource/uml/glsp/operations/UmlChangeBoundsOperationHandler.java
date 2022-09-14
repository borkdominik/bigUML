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

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSBasicOperationHandler;
import org.eclipse.glsp.server.operations.ChangeBoundsOperation;
import org.eclipse.glsp.server.types.ElementAndBounds;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.modelserver.unotation.Shape;

public class UmlChangeBoundsOperationHandler
   extends EMSBasicOperationHandler<ChangeBoundsOperation, UmlModelServerAccess> {

   protected UmlModelState getUmlModelState() { return (UmlModelState) getEMSModelState(); }

   @Override
   public void executeOperation(final ChangeBoundsOperation changeBoundsOperation,
      final UmlModelServerAccess modelServerAccess) {
      UmlModelState modelState = getUmlModelState();
      Map<Shape, ElementAndBounds> changeBoundsMap = new HashMap<>();
      for (ElementAndBounds element : changeBoundsOperation.getNewBounds()) {
         modelState.getIndex().getNotation(element.getElementId(), Shape.class).ifPresent(notationElement -> {
            changeBoundsMap.put(notationElement, element);
         });
      }
      modelServerAccess.changeBounds(changeBoundsMap)
         .thenAccept(response -> {
            if (!response.body()) {
               throw new GLSPServerException("Could not change bounds: " + changeBoundsMap.toString());
            }
         });
   }

   @Override
   public String getLabel() { return "Change bounds"; }
}
