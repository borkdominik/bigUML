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
package com.eclipsesource.uml.glsp.core.operations;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.Set;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.AbstractEMSOperationHandler;
import org.eclipse.glsp.server.operations.DeleteOperation;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class UmlDeleteOperationHandler extends AbstractEMSOperationHandler<DeleteOperation> {

   @Inject
   private Set<DiagramDeleteOperationHandler> deleteOperationHandlers;

   @Inject
   private UmlModelState modelState;

   @Override
   public void executeOperation(final DeleteOperation operation) {
      Representation diagramType = modelState.getRepresentation();
      var deleteOperationHandler = deleteOperationHandlers.stream().filter(handler -> handler.supports(diagramType))
         .findFirst();

      operation.getElementIds().forEach(elementId -> {
         EObject semanticElement = getOrThrow(modelState.getIndex().getEObject(elementId),
            EObject.class, "Could not find element for id '" + elementId + "', no delete operation executed.");

         deleteOperationHandler
            .orElseThrow(() -> new GLSPServerException("No handler found for diagram " + diagramType))
            .delete(semanticElement);
      });
   }

}
