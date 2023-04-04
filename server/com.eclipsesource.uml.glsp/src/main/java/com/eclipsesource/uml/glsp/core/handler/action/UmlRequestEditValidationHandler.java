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
package com.eclipsesource.uml.glsp.core.handler.action;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.glsp.server.actions.AbstractActionHandler;
import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.features.directediting.ContextEditValidatorRegistry;
import org.eclipse.glsp.server.features.directediting.RequestEditValidationAction;
import org.eclipse.glsp.server.features.directediting.SetEditValidationResultAction;
import org.eclipse.glsp.server.features.directediting.ValidationStatus;

import com.google.inject.Inject;

public class UmlRequestEditValidationHandler extends AbstractActionHandler<RequestEditValidationAction> {

   private static Logger LOGGER = LogManager.getLogger(UmlRequestEditValidationHandler.class);

   @Inject
   protected ContextEditValidatorRegistry contextEditValidatorRegistry;

   @Override
   public List<Action> executeAction(final RequestEditValidationAction action) {
      var validationResult = contextEditValidatorRegistry.get(action.getContextId())
         .map(provider -> provider.validate(action));
      if (!validationResult.isPresent()) {
         var message = "No validator registered for the context '" + action.getContextId() + "'";
         LOGGER.warn(message);
         return listOf(new SetEditValidationResultAction(ValidationStatus.warning(message)));
      }
      return listOf(new SetEditValidationResultAction(validationResult.get()));
   }
}
