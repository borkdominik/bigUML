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
package com.eclipsesource.uml.modelserver.core;

import java.net.MalformedURLException;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.eclipse.emfcloud.modelserver.client.v2.ModelServerClientV2;
import org.eclipse.emfcloud.modelserver.common.codecs.Codec;
import org.eclipse.emfcloud.modelserver.emf.configuration.EPackageConfiguration;

import com.eclipsesource.uml.modelserver.core.codecs.UmlCodec;
import com.eclipsesource.uml.modelserver.core.routing.UmlModelServerPaths;

public class UmlModelServerClient extends ModelServerClientV2 {

   private static final Map<String, Codec> SUPPORTED_UML_FORMATS = Map.of(
      UmlModelServerPaths.FORMAT_UML, new UmlCodec());

   public UmlModelServerClient(final String baseUrl, final EPackageConfiguration... configurations)
      throws MalformedURLException {
      super(baseUrl,
         Stream.concat(SUPPORTED_FORMATS.entrySet().stream(), SUPPORTED_UML_FORMATS.entrySet().stream()).collect(
            Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue)),
         configurations);
   }

   /*-
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
