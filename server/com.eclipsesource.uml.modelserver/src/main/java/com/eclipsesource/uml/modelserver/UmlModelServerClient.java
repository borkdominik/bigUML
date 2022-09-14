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
package com.eclipsesource.uml.modelserver;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;

import org.eclipse.emfcloud.modelserver.client.Response;
import org.eclipse.emfcloud.modelserver.client.v1.ModelServerClientV1;
import org.eclipse.emfcloud.modelserver.common.ModelServerPathParametersV1;
import org.eclipse.emfcloud.modelserver.common.codecs.Codec;
import org.eclipse.emfcloud.modelserver.common.codecs.DefaultJsonCodec;
import org.eclipse.emfcloud.modelserver.common.codecs.XmiCodec;
import org.eclipse.emfcloud.modelserver.emf.configuration.EPackageConfiguration;
import org.eclipse.emfcloud.modelserver.jsonschema.Json;
import org.eclipse.uml2.uml.resource.UMLResource;

import okhttp3.Request;

public class UmlModelServerClient extends ModelServerClientV1 {

   private static final Map<String, Codec> SUPPORTED_UML_FORMATS = Map.of(
      ModelServerPathParametersV1.FORMAT_JSON, new DefaultJsonCodec(),
      ModelServerPathParametersV1.FORMAT_XMI, new XmiCodec(),
      UMLResource.FILE_EXTENSION, new UmlCodec());

   public UmlModelServerClient(final String baseUrl, final EPackageConfiguration... configurations)
      throws MalformedURLException {
      super(baseUrl, SUPPORTED_UML_FORMATS, configurations);
   }

   public CompletableFuture<Response<List<String>>> getUmlTypes(final String modelUri) {
      final Request request = new Request.Builder()
         .url(
            createHttpUrlBuilder(getBaseUrl() + UmlModelServerPaths.UML_TYPES)
               .addQueryParameter(ModelServerPathParametersV1.MODEL_URI, modelUri)
               .build())
         .build();

      return makeCallAndGetDataBody(request)
         .thenApply(response -> response.mapBody(body -> {
            List<String> uris = new ArrayList<>();
            try {
               Json.parse(body).forEach(uri -> uris.add(uri.textValue()));
               return uris;
            } catch (IOException e) {
               throw new CompletionException(e);
            }
         }));
   }

}
