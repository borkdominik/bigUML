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
package com.eclipsesource.uml.glsp.core.handler.operation.create;

import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.AbstractEMSOperationHandler;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.common.RepresentationKey;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.google.inject.Inject;

public class UmlCreateNodeOperationHandler extends AbstractEMSOperationHandler<CreateNodeOperation> {

   @Inject
   private DiagramCreateHandlerRegistry registry;

   @Inject
   private UmlModelState modelState;

   @Override
   public void executeOperation(final CreateNodeOperation operation) {
      var representation = modelState.getUnsafeRepresentation();

      var handler = registry.get(RepresentationKey.of(representation, operation.getElementTypeId()));

      handler
         .orElseThrow(
            () -> {
               registry.printContent();
               return new GLSPServerException(
                  "No create node handler found for element " + operation.getElementTypeId());
            })
         .handle(operation);
   }

   @Override
   public String getLabel() { return "Uml: Create node"; }

}
