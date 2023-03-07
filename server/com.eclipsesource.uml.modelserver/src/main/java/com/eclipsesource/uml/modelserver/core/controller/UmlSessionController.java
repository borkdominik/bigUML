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
package com.eclipsesource.uml.modelserver.core.controller;

import java.util.Map;
import java.util.Optional;
import java.util.function.Supplier;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.command.CCommandExecutionResult;
import org.eclipse.emfcloud.modelserver.emf.common.DefaultSessionController;

import com.eclipsesource.uml.modelserver.core.controller.response.DirtyStateProvider;
import com.fasterxml.jackson.databind.JsonNode;

public class UmlSessionController extends DefaultSessionController {

   protected DirtyStateProvider dirtyState = new DirtyStateProvider();

   @Override
   public void modelCreated(final String modeluri) {
      Optional<EObject> root = modelRepository.getModel(modeluri);
      if (root.isEmpty()) {
         broadcastError(modeluri, "Could not load changed object");
         return;
      }
      broadcastFullUpdate(modeluri, root.get());
      broadcastDirtyState(modeluri, modelRepository.getDirtyState(modeluri), DirtyStateReason.CREATE);
      broadcastValidation(modeluri);
   }

   @Override
   public void modelUpdated(final String modeluri) {
      Optional<EObject> root = modelRepository.getModel(modeluri);
      if (root.isEmpty()) {
         broadcastError(modeluri, "Could not load changed object");
         return;
      }
      broadcastFullUpdate(modeluri, root.get());
      broadcastDirtyState(modeluri, modelRepository.getDirtyState(modeluri), DirtyStateReason.UPDATE);
      broadcastValidation(modeluri);
   }

   @Override
   public void modelDeleted(final String modeluri) {
      broadcastFullUpdate(modeluri, null);
   }

   @Override
   public void modelSaved(final String modeluri) {
      broadcastDirtyState(modeluri, modelRepository.getDirtyState(modeluri), DirtyStateReason.SAVE);
   }

   @Override
   public void allModelsSaved() {
      for (String modeluri : modelRepository.getAbsoluteModelUris()) {
         broadcastDirtyState(modeluri, modelRepository.getDirtyState(modeluri), DirtyStateReason.SAVE);
      }
   }

   @Override
   public void commandExecuted(final String modeluri, final Supplier<? extends CCommandExecutionResult> execution,
      final Supplier<Map<URI, JsonNode>> patches) {
      Optional<EObject> root = modelRepository.getModel(modeluri);
      if (root.isEmpty()) {
         broadcastError(modeluri, "Could not load changed object");
         return;
      }

      broadcastIncrementalUpdatesV1(modeluri, execution);
      broadcastIncrementalUpdatesV2(patches);

      broadcastDirtyState(modeluri, modelRepository.getDirtyState(modeluri), DirtyStateReason.INCREMENTAL_UPDATE);
      broadcastValidation(modeluri);
   }

   protected void broadcastIncrementalUpdatesV1(final String modeluri,
      final Supplier<? extends CCommandExecutionResult> execution) {
      if (hasSession(modeluri)) {
         CCommandExecutionResult v1Update = execution.get();
         if (v1Update != null) {
            broadcastIncrementalUpdates(modeluri, v1Update);
         }
      }
   }

   protected void broadcastIncrementalUpdatesV2(final Supplier<Map<URI, JsonNode>> patches) {
      Map<URI, JsonNode> map = patches.get();
      if (map != null) {
         for (Map.Entry<URI, JsonNode> entry : map.entrySet()) {
            String patchModelUri = entry.getKey().toString();
            if (hasV2Session(patchModelUri)) {
               JsonNode v2Update = entry.getValue();
               if (v2Update != null) {
                  broadcastIncrementalUpdatesV2(patchModelUri, v2Update);
               }
            }
         }
      }
   }

   protected void broadcastDirtyState(final String modeluri, final Boolean isDirty, final String reason) {
      getAllOpenSessions(modeluri).forEach(session -> session.send(dirtyState.get(isDirty, reason)));
   }
}
