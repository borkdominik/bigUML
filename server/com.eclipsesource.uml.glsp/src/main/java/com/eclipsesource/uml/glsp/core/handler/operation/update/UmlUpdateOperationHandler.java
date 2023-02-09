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
package com.eclipsesource.uml.glsp.core.handler.operation.update;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.AbstractEMSOperationHandler;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.common.DoubleKey;
import com.eclipsesource.uml.glsp.core.common.RepresentationKey;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.google.inject.Inject;

public class UmlUpdateOperationHandler
   extends AbstractEMSOperationHandler<UpdateOperation> {

   @Inject
   private DiagramUpdateHandlerRegistry registry;

   @Inject
   private UmlModelState modelState;

   @Override
   public void executeOperation(final UpdateOperation operation) {
      var representation = modelState.getUnsafeRepresentation();

      var elementId = operation.getElementId();
      var contextId = operation.getContextId();

      var semanticElement = getOrThrow(modelState.getIndex().getEObject(elementId),
         EObject.class,
         "Could not find semantic element for id '" + elementId + "', no update operation executed.");

      var handler = registry
         .get(RepresentationKey.of(representation, DoubleKey.of(semanticElement.getClass(), contextId)));

      handler
         .orElseThrow(() -> {
            registry.printContent();
            return new GLSPServerException(
               "No handler found for element class " + semanticElement.getClass().getName() + " with contextId "
                  + contextId + " for elementId " + elementId);
         })
         .handle(operation);
   }

   @Override
   public String getLabel() { return "Uml: Update"; }
}
