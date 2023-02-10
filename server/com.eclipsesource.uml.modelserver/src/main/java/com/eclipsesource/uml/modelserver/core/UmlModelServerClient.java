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

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.eclipse.emfcloud.modelserver.client.Response;
import org.eclipse.emfcloud.modelserver.client.v2.ModelServerClientV2;
import org.eclipse.emfcloud.modelserver.common.ModelServerPathParametersV2;
import org.eclipse.emfcloud.modelserver.common.codecs.Codec;
import org.eclipse.emfcloud.modelserver.emf.configuration.EPackageConfiguration;
import org.eclipse.emfcloud.modelserver.jsonschema.Json;

import com.eclipsesource.uml.modelserver.core.codec.UmlCodec;
import com.eclipsesource.uml.modelserver.core.models.TypeInformation;
import com.eclipsesource.uml.modelserver.core.routing.UmlModelServerPaths;
import com.google.gson.Gson;

import okhttp3.Request;

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

   public CompletableFuture<Response<Set<TypeInformation>>> getUmlTypeInformation(final String modelUri) {
      final var request = new Request.Builder()
         .url(
            createHttpUrlBuilder(
               getBaseUrl() + String.format("%s/%s", UmlModelServerPaths.PATH, UmlModelServerPaths.UML_TYPES))
                  .addQueryParameter(ModelServerPathParametersV2.MODEL_URI, modelUri)
                  .build())
         .build();

      return makeCallAndGetDataBody(request)
         .thenApply(response -> response.mapBody(body -> {
            var elements = new HashSet<TypeInformation>();
            var gson = new Gson();

            try {
               Json.parse(body).forEach(node -> {

                  var element = node.isTextual()
                     ? gson.fromJson(node.textValue(), TypeInformation.class)
                     : gson.fromJson(node.toString(), TypeInformation.class);

                  elements.add(element);
               });

               return elements;
            } catch (IOException e) {
               throw new CompletionException(e);
            }
         }));

   }
}
