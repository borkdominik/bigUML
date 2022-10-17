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

import java.util.List;
import java.util.Optional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.EMSOperationHandler;
import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.operations.Operation;
import org.eclipse.glsp.server.operations.OperationActionHandler;
import org.eclipse.glsp.server.operations.OperationHandler;

public class UmlOperationActionHandler extends OperationActionHandler {
   private static Logger LOGGER = LogManager.getLogger(UmlOperationActionHandler.class.getSimpleName());

   @Override
   public List<Action> executeAction(final Operation operation) {
      Optional<? extends OperationHandler> operationHandler = operationHandlerRegistry.get(operation);
      if (operationHandler.isPresent()) {
         return executeHandler(operation, operationHandler.get());
      }

      LOGGER.debug("No operation handler found for: " + operation);
      return none();
   }

   @Override
   protected List<Action> executeHandler(final Operation operation, final OperationHandler handler) {
      if (handler instanceof EMSOperationHandler) {
         handler.execute(operation);
      } else {
         LOGGER.debug("Ignoring operation: " + operation);
      }
      return none();
   }
}
