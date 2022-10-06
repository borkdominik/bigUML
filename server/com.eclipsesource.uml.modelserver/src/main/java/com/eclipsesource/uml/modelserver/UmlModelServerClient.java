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

public class UmlModelServerClient {
   /*-
   private static final Map<String, Codec> SUPPORTED_UML_FORMATS = Map.of(
      UMLResource.FILE_EXTENSION, new UmlCodec());
   
   public UmlModelServerClient(final String baseUrl, final EPackageConfiguration... configurations)
      throws MalformedURLException {
      super(baseUrl, SUPPORTED_UML_FORMATS, configurations);
   }
   
    TODO: Enable it later
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
   */
}
