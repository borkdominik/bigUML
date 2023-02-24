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
package com.eclipsesource.uml.glsp.core.handler.operation.delete;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSOperationHandler;
import org.eclipse.glsp.server.operations.DeleteOperation;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.common.RepresentationKey;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.google.inject.Inject;

public class UmlDeleteOperationHandler extends EMSOperationHandler<DeleteOperation> {

   @Inject
   private DiagramDeleteHandlerRegistry registry;

   @Inject
   private UmlModelState modelState;

   @Override
   public void executeOperation(final DeleteOperation operation) {
      var representation = modelState.getUnsafeRepresentation();

      operation.getElementIds().forEach(elementId -> {
         var semanticElement = getOrThrow(modelState.getIndex().getEObject(elementId),
            EObject.class, "Could not find semantic element for id '" + elementId + "', no delete operation executed.");

         var handler = registry.get(RepresentationKey.of(representation, semanticElement.getClass()));

         handler
            .orElseThrow(
               () -> {
                  registry.printContent();
                  return new GLSPServerException(
                     "No delete handler found for class " + semanticElement.getClass().getName());
               })
            .handle(semanticElement);
      });

      // printContent();
   }

   @Override
   public String getLabel() { return "Uml: Delete"; }

}
