/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp;

import org.eclipse.emfcloud.modelserver.glsp.EMSGLSPServer;

public class UmlGLSPServer extends EMSGLSPServer {

   /*-
   @Override
   protected ModelServerClientV2 createModelServerClient(final String modelServerURL) throws MalformedURLException {
      return new UmlModelServerClient(modelServerURL);
   }
   
   @Override
   public CompletableFuture<Void> disposeClientSession(final DisposeClientSessionParameters params) {
      var modelServerClient = modelServerClientProvider.get();
      if (modelServerClient.isPresent()) {
         String sourceURI = ClientOptionsUtil.getSourceUri(params.getArgs())
            .orElseThrow(() -> new GLSPServerException("No source URI given to dispose client session!"));
         modelServerClient.get()
            .unsubscribe(sourceURI.replace(UmlNotationUtil.NOTATION_EXTENSION, UMLResource.FILE_EXTENSION));
      }
      return super.disposeClientSession(params);
   }
   */
}
