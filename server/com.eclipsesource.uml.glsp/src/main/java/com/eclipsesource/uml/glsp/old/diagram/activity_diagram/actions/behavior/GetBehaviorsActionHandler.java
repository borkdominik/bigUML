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
package com.eclipsesource.uml.glsp.old.diagram.activity_diagram.actions.behavior;

public class GetBehaviorsActionHandler {
   /*-
   private static Logger LOGGER = LogManager.getLogger(UmlGetTypesActionHandler.class.getSimpleName());
   
   public List<Action> executeAction(final GetBehaviorsAction getBehaviorsAction,
      final ActivityModelServerAccess modelServerAccess) {
      LOGGER.info("Behaviors suggestion activated");
      List<String> behaviors = new ArrayList<>();
      try {
         Response<List<String>> response = modelServerAccess.getUmlBehaviors().get();
         behaviors = response.body();
         Collections.sort(behaviors);
      } catch (InterruptedException | ExecutionException e) {
         e.printStackTrace();
      }
      return List.of(new CallBehaviorsAction(behaviors));
   }
   */
}
