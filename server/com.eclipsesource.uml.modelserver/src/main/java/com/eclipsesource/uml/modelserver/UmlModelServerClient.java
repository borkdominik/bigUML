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
package com.eclipsesource.uml.modelserver;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;

import org.apache.log4j.Logger;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.client.ModelServerClient;
import org.eclipse.emfcloud.modelserver.client.Response;
import org.eclipse.emfcloud.modelserver.common.ModelServerPathParameters;
import org.eclipse.emfcloud.modelserver.common.ModelServerPathParametersV1;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.common.codecs.DefaultJsonCodec;
import org.eclipse.emfcloud.modelserver.common.codecs.XmiCodec;
import org.eclipse.emfcloud.modelserver.jsonschema.Json;
import org.eclipse.uml2.uml.resource.UMLResource;

import com.google.common.collect.ImmutableSet;

import okhttp3.Request;

public class UmlModelServerClient extends ModelServerClient {

   private static final Set<String> DEFAULT_SUPPORTED_FORMATS = ImmutableSet.of(ModelServerPathParameters.FORMAT_JSON,
      ModelServerPathParameters.FORMAT_XMI, UMLResource.FILE_EXTENSION);

   private static Logger LOGGER = Logger.getLogger(UmlModelServerClient.class.getSimpleName());

   public UmlModelServerClient(final String baseUrl) throws MalformedURLException {
      super(baseUrl);
   }

   @Override
   protected boolean isSupportedFormat(final String format) {
      return DEFAULT_SUPPORTED_FORMATS.contains(format);
   }

   @Override
   public Optional<EObject> decode(final String payload, final String format) {
      try {
         if (format.equals(UMLResource.FILE_EXTENSION)) {
            return new UmlCodec().decode(payload);
         } else if (format.equals(ModelServerPathParametersV1.FORMAT_XMI)) {
            return new XmiCodec().decode(payload);
         }
         return new DefaultJsonCodec().decode(payload);
      } catch (DecodingException e) {
         LOGGER.error("Decoding of " + payload + " with " + format + " format failed");
      }
      return Optional.empty();
   }

   public CompletableFuture<Response<List<String>>> getUmlTypes(final String modelUri) {
      final Request request = new Request.Builder()
         .url(
            createHttpUrlBuilder(baseUrl + UmlModelServerPaths.UML_TYPES)
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
