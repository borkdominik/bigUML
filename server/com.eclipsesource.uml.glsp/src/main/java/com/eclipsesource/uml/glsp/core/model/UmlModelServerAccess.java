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
package com.eclipsesource.uml.glsp.core.model;

import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.client.Response;
import org.eclipse.emfcloud.modelserver.client.SubscriptionListener;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.glsp.notation.integration.EMSNotationModelServerAccess;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import org.eclipse.glsp.server.types.ElementAndBounds;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.modelserver.core.routing.UmlModelServerPaths;

public class UmlModelServerAccess extends EMSNotationModelServerAccess {

   private static final Logger LOGGER = LogManager.getLogger(UmlModelServerAccess.class);

   /*-
    * The whole communication between GLSP and ModelServer happens through the {@link
    * ModelServerPathParametersV2.FORMAT_JSON_V2 JSON_V2} format, however, we currently want to use our own format
    * {@link UmlCodec UmlCodec} for this specific case
    *
    * The reason is we want to access the resource of the EObject
    */
   @Override
   public EObject getSemanticModel() {
      try {
         return getModelServerClient().get(getSemanticURI(), UmlModelServerPaths.FORMAT_UML)
            .thenApply(res -> res.body()).get();
      } catch (InterruptedException | ExecutionException e) {
         LOGGER.error(e);
         throw new GLSPServerException("Error during model loading", e);
      }
   }

   @Override
   public CompletableFuture<Response<String>> changeBounds(final Map<Shape, ElementAndBounds> changeBoundsMap) {
      throw new UnsupportedOperationException(
         "Change Bounds is removed. Please use exec with combination with the new ChangeBoundsContribution.");
   }

   @Override
   public CompletableFuture<Response<String>> changeBounds(final Shape shape, final ElementAndBounds changedBounds) {
      throw new UnsupportedOperationException(
         "Change Bounds is removed. Please use exec with combination with the new ChangeBoundsContribution.");
   }

   public void subscribe(final String uri, final SubscriptionListener subscriptionListener) {
      this.subscriptionListener = subscriptionListener;
      getModelServerClient().subscribe(uri, subscriptionListener);
   }

   public CompletableFuture<Response<String>> exec(final CCommand command) {
      return super.edit(command);
   }
}
