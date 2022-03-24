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
package com.eclipsesource.uml.glsp.actions.activity.behavior;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.apache.log4j.Logger;
import org.eclipse.emfcloud.modelserver.client.Response;
import org.eclipse.emfcloud.modelserver.glsp.actions.handlers.EMSBasicActionHandler;
import org.eclipse.glsp.server.actions.Action;

import com.eclipsesource.uml.glsp.actions.UmlGetTypesActionHandler;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;

public class GetBehaviorsActionHandler extends EMSBasicActionHandler<GetBehaviorsAction, UmlModelServerAccess> {

   private static Logger LOGGER = Logger.getLogger(UmlGetTypesActionHandler.class.getSimpleName());

   @Override
   public List<Action> executeAction(GetBehaviorsAction getBehaviorsAction, UmlModelServerAccess modelServerAccess) {
      LOGGER.info("Behaviors suggestion activated");
      List<String> behaviors = new ArrayList<>();
      try {
         Response<List<String>> response = modelServerAccess.getUmlBehaviors().get();
         behaviors = response.body();
         Collections.sort(behaviors);
      } catch (InterruptedException | ExecutionException e) {
         e.printStackTrace();
      }
      return List.of(new CallBehaviorsAction(behaviors));   }
}
