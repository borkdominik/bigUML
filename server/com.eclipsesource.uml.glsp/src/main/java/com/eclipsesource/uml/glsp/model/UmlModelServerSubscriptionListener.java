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
package com.eclipsesource.uml.glsp.model;

import java.util.Optional;

import org.apache.log4j.Logger;
import org.eclipse.emfcloud.modelserver.client.XmiToEObjectSubscriptionListener;
import org.eclipse.emfcloud.modelserver.command.CCommandExecutionResult;
import org.eclipse.glsp.graph.GModelRoot;
import org.eclipse.glsp.server.actions.ActionDispatcher;
import org.eclipse.glsp.server.actions.SetDirtyStateAction;
import org.eclipse.glsp.server.features.core.model.RequestBoundsAction;

public class UmlModelServerSubscriptionListener extends XmiToEObjectSubscriptionListener {

   private static Logger LOGGER = Logger.getLogger(UmlModelServerSubscriptionListener.class.getSimpleName());
   private final ActionDispatcher actionDispatcher;
   private final UmlModelState modelState;

   public UmlModelServerSubscriptionListener(final UmlModelState modelState, final ActionDispatcher actionDispatcher) {
      this.actionDispatcher = actionDispatcher;
      this.modelState = modelState;
   }

   @Override
   public void onIncrementalUpdate(final CCommandExecutionResult commandResult) {
      LOGGER.debug("Incremental update from model server received: " + commandResult);

      // Currently reload the models, we might consider applying the change recordings instead
      modelState.refresh();

      GModelRoot gmodelRoot = modelState.getGModelFactory().create();
      modelState.setRoot(gmodelRoot);

      actionDispatcher.dispatch(modelState.getClientId(), new RequestBoundsAction(gmodelRoot));

   }

   @Override
   public void onDirtyChange(final boolean isDirty) {
      LOGGER.debug("Dirty State Changed: " + isDirty + " for clientId: " + modelState.getClientId());
      actionDispatcher.dispatch(modelState.getClientId(), new SetDirtyStateAction(isDirty));
   }

   @Override
   public void onError(final Optional<String> message) {
      LOGGER.debug("Error from model server received: " + message.get());
   }

   @Override
   public void onClosing(final int code, final String reason) {
      LOGGER.debug("Closing connection to model server, reason: " + reason);
   }

   @Override
   public void onClosed(final int code, final String reason) {
      LOGGER.debug("Closed connection to model server, reason: " + reason);
   }

}
