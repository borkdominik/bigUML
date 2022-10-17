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
package com.eclipsesource.uml.glsp.core.handler.action;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.emfcloud.modelserver.glsp.actions.handlers.AbstractEMSActionHandler;
import org.eclipse.glsp.server.actions.Action;

import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.google.inject.Inject;

public class UmlGetTypesActionHandler extends AbstractEMSActionHandler<GetTypesAction> {

   private static Logger LOGGER = LogManager.getLogger(UmlGetTypesActionHandler.class.getSimpleName());

   @Inject
   protected UmlModelServerAccess modelServerAccess;

   @Override
   public List<Action> executeAction(final GetTypesAction action) {
      // TODO: Find out why this is required
      /*
       * try {
       * Response<List<String>> response = modelServerAccess.getUmlTypes().get();
       * List<String> types = response.body();
       * Collections.sort(types);
       * return List.of(new ReturnTypesAction(types));
       * } catch (InterruptedException | ExecutionException e) {
       * LOGGER.error("Error while fetching UML types from Model Server");
       * e.printStackTrace();
       * }
       */
      return List.of();
   }

}
