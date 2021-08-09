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
package com.eclipsesource.uml.glsp;

import java.util.concurrent.CompletableFuture;

import org.apache.log4j.Logger;
import org.eclipse.emfcloud.modelserver.client.Response;
import org.eclipse.glsp.server.jsonrpc.DefaultGLSPServer;

import com.eclipsesource.uml.glsp.modelserver.ModelServerClientProvider;
import com.eclipsesource.uml.modelserver.UmlModelServerClient;
import com.google.inject.Inject;

public class UmlGLSPServer extends DefaultGLSPServer<UmlGLSPServerInitializeOptions> {

   static Logger LOGGER = Logger.getLogger(UmlGLSPServer.class.getSimpleName());

   @Inject
   private ModelServerClientProvider modelServerClientProvider;

   public UmlGLSPServer() {
      super(UmlGLSPServerInitializeOptions.class);
   }

   @Override
   public CompletableFuture<Boolean> handleOptions(final UmlGLSPServerInitializeOptions options) {
      if (options != null) {
         LOGGER.debug(String.format("[%s] Pinging modelserver", options.getTimestamp()));

         try {
            UmlModelServerClient client = new UmlModelServerClient(options.getModelServerURL());
            boolean alive = client.ping().thenApply(Response<Boolean>::body).get();
            if (alive) {
               modelServerClientProvider.setModelServerClient(client);
               return CompletableFuture.completedFuture(true);
            }

         } catch (Exception e) {
            LOGGER.error("Error during initialization of modelserver connection", e);
         }
      }
      return CompletableFuture.completedFuture(true);
   }

}
