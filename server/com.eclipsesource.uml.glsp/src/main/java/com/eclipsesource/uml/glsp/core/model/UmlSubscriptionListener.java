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
package com.eclipsesource.uml.glsp.core.model;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emfcloud.modelserver.client.ModelServerNotification;
import org.eclipse.emfcloud.modelserver.emf.common.JsonResponseType;
import org.eclipse.emfcloud.modelserver.glsp.EMSSubscriptionListener;
import org.eclipse.glsp.server.actions.ActionDispatcher;
import org.eclipse.glsp.server.actions.SetDirtyStateAction;

import com.eclipsesource.uml.glsp.core.handler.action.UmlRefreshModelAction;
import com.eclipsesource.uml.glsp.core.utils.JsonUtils;
import com.google.gson.Gson;

public class UmlSubscriptionListener extends EMSSubscriptionListener {
   private static final Logger LOGGER = LogManager.getLogger(UmlSubscriptionListener.class);

   protected final Gson gson;

   public UmlSubscriptionListener(final String modelUri, final ActionDispatcher actionDispatcher) {
      super(modelUri, actionDispatcher);
      gson = new Gson();
   }

   @Override
   public void onNotification(final ModelServerNotification notification) {
      switch (notification.getType()) {
         case JsonResponseType.DIRTYSTATE: {
            var data = notification.getData()
               .orElseThrow(() -> new RuntimeException("Could not parse 'data' field"));

            JsonUtils.parse(data, DirtyState.class).ifPresentOrElse(dirtyState -> {
               onDirtyChange(dirtyState.isDirty, dirtyState.reason);
            }, () -> {
               var isDirty = Boolean.parseBoolean(data);
               onDirtyChange(isDirty);
            });

            break;
         }
         default:
            super.onNotification(notification);
      }
   }

   @Override
   public void onIncrementalUpdate(final String incrementalUpdate) {
      logResponse("Incremental <JsonPatch> update from model server received: " + incrementalUpdate);
      this.refresh(SetDirtyStateAction.Reason.EXTERNAL);
   }

   @Override
   public void onFullUpdate(final String fullUpdate) {
      if (fullUpdate == null || fullUpdate.equals("null")) {
         logResponse("Full <JsonString> update from model server will be ignored: " + fullUpdate);
      } else {
         logResponse("Full <JsonString> update from model server received: " + fullUpdate);
         this.refresh();
      }
   }

   public void onDirtyChange(final boolean isDirty, final String reason) {
      logResponse("Dirty State Changed: " + isDirty + ", reason: " + reason);
      actionDispatcher.dispatch(new SetDirtyStateAction(isDirty, reason));
   }

   @Override
   protected void refresh() {
      actionDispatcher.dispatch(new UmlRefreshModelAction());
   }

   protected void refresh(final String reason) {
      actionDispatcher.dispatch(new UmlRefreshModelAction(reason));
   }

   @Override
   protected void logResponse(final String message) {
      LOGGER.debug("[" + URI.createURI(modelUri).lastSegment() + "]: " + message);
   }

   public static class DirtyState {
      public boolean isDirty;
      public String reason;
   }
}
