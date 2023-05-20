/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.core.handler.operation.reconnect_edge;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSOperationHandler;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.glsp.server.operations.ReconnectEdgeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.common.RepresentationKey;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.google.inject.Inject;

public class UmlReconnectEdgeOperationHandler extends EMSOperationHandler<ReconnectEdgeOperation> {
   private static Logger LOGGER = LogManager.getLogger(UmlReconnectEdgeOperationHandler.class.getSimpleName());

   @Inject
   protected DiagramReconnectEdgeHandlerRegistry registry;
   @Inject
   protected UmlModelState modelState;
   @Inject
   protected EMFIdGenerator idGenerator;

   @Override
   protected void executeOperation(final ReconnectEdgeOperation operation) {
      if (operation.getEdgeElementId() == null || operation.getSourceElementId() == null
         || operation.getTargetElementId() == null) {
         throw new IllegalArgumentException("Incomplete reconnect connection action");
      }

      var modelId = idGenerator.getOrCreateId(modelState.getSemanticModel());
      if (operation.getSourceElementId().equals(modelId) || operation.getTargetElementId().equals(modelId)) {
         // client tool failure, do nothing
         LOGGER.debug("SourceId or targetId was equal to modelId");
         return;
      }

      var representation = modelState.getUnsafeRepresentation();

      var elementId = operation.getEdgeElementId();

      var semanticElement = getOrThrow(modelState.getIndex().getEObject(elementId), EObject.class,
         "Could not find semantic element for id '" + elementId
            + "', no reconnecting operation executed.");

      var handler = registry
         .get(RepresentationKey.of(representation, semanticElement.getClass()));

      handler
         .orElseThrow(
            () -> {
               registry.printContent();
               return new GLSPServerException(
                  "No reconnect edge handler found for class " + semanticElement.getClass());
            })
         .handle(operation);
   }

}
