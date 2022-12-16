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
package com.eclipsesource.uml.glsp.core;

import java.net.MalformedURLException;
import java.util.concurrent.CompletableFuture;

import org.eclipse.emfcloud.modelserver.client.v2.ModelServerClientV2;
import org.eclipse.emfcloud.modelserver.glsp.EMSGLSPServer;
import org.eclipse.glsp.server.protocol.DisposeClientSessionParameters;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.glsp.server.utils.ClientOptionsUtil;
import org.eclipse.uml2.uml.resource.UMLResource;

import com.eclipsesource.uml.modelserver.core.UmlModelServerClient;
import com.eclipsesource.uml.modelserver.shared.utils.UmlNotationUtil;

public class UmlGLSPServer extends EMSGLSPServer {

   @Override
   protected ModelServerClientV2 createModelServerClient(final String modelServerURL) throws MalformedURLException {
      return new UmlModelServerClient(modelServerURL);
   }

   @Override
   public CompletableFuture<Void> disposeClientSession(final DisposeClientSessionParameters params) {
      var modelServerClient = modelServerClientProvider.get();
      if (modelServerClient.isPresent()) {
         var sourceURI = ClientOptionsUtil.getSourceUri(params.getArgs())
            .orElseThrow(() -> new GLSPServerException("No source URI given to dispose client session!"));
         modelServerClient.get()
            .unsubscribe(sourceURI.replace(UMLResource.FILE_EXTENSION, UmlNotationUtil.NOTATION_EXTENSION));
      }
      return super.disposeClientSession(params);
   }
}
