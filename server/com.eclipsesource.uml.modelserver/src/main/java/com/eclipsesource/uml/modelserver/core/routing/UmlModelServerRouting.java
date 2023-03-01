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
package com.eclipsesource.uml.modelserver.core.routing;

import static io.javalin.apibuilder.ApiBuilder.path;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emfcloud.modelserver.common.ModelServerPathParametersV2;
import org.eclipse.emfcloud.modelserver.common.Routing;
import org.eclipse.emfcloud.modelserver.common.codecs.EncodingException;
import org.eclipse.emfcloud.modelserver.emf.common.JsonResponse;
import org.eclipse.emfcloud.modelserver.emf.common.ModelURIConverter;
import org.eclipse.emfcloud.modelserver.emf.common.codecs.JsonCodec;
import org.eclipse.emfcloud.modelserver.emf.common.util.ContextRequest;
import org.eclipse.emfcloud.modelserver.emf.common.util.ContextResponse;

import com.eclipsesource.uml.modelserver.core.codec.UmlCodec;
import com.eclipsesource.uml.modelserver.core.resource.UmlModelResourceManager;
import com.google.inject.Inject;

import io.javalin.Javalin;
import io.javalin.apibuilder.ApiBuilder;
import io.javalin.apibuilder.EndpointGroup;
import io.javalin.http.Context;

public class UmlModelServerRouting implements Routing {

   @Inject
   protected UmlModelResourceManager resourceManager;
   @Inject
   protected ModelURIConverter uriConverter;
   @Inject
   protected Javalin javalin;

   protected UmlCodec umlCodec = new UmlCodec();

   @Override
   public void bindRoutes() {
      this.bindRoutes(this::apiEndpoints);
   }

   public void bindRoutes(final EndpointGroup endpointGroup) {
      javalin.routes(() -> endpoints(endpointGroup));
   }

   private void endpoints(final EndpointGroup endpointGroup) {
      path(UmlModelServerPaths.BASE_PATH, endpointGroup::addEndpoints);
   }

   private void apiEndpoints() {
      ApiBuilder.get(UmlModelServerPaths.UML_CREATE, this::createUmlModel);
      ApiBuilder.get(UmlModelServerPaths.UML_TYPES, this::getUmlTypes);
   }

   private void createUmlModel(final Context ctx) {
      uriConverter.resolveModelURI(ctx).map(URI::toString).ifPresentOrElse(
         uri -> {
            ContextRequest.getParam(ctx, UmlModelServerPathsParameters.UML_DIAGRAM_TYPE).ifPresentOrElse(
               typeParam -> {
                  boolean result = resourceManager.createUmlModel(uri, typeParam);
                  ctx.json(result ? JsonResponse.success() : JsonResponse.error());
               },
               () -> ContextResponse.missingParameter(ctx, UmlModelServerPathsParameters.UML_DIAGRAM_TYPE));
         },
         () -> ContextResponse.missingParameter(ctx, ModelServerPathParametersV2.MODEL_URI));
   }

   protected void getUmlTypes(final Context ctx) {
      uriConverter.resolveModelURI(ctx).map(URI::toString).ifPresentOrElse(
         uri -> {
            try {
               ctx.json(JsonResponse
                  .success(JsonCodec.encode(resourceManager.getUmlTypeInformation(uri))));
            } catch (EncodingException e) {
               ContextResponse.encodingError(ctx, e);
            }
         },
         () -> ContextResponse.missingParameter(ctx, ModelServerPathParametersV2.MODEL_URI));
   }

   /*- TODO: Enable it later
   protected void getUmlBehaviors(final Context ctx) {
      uriConverter.resolveModelURI(ctx).map(URI::toString).ifPresentOrElse(
         uri -> {
            try {
               ctx.json(JsonResponse
                  .success(JsonCodec.encode(((UmlModelResourceManager) resourceManager).getUmlTypes(uri))));
            } catch (EncodingException e) {
               encodingError(ctx, e);
            }
         },
         () -> missingParameter(ctx, ModelServerPathParametersV1.MODEL_URI));
   }
   */
}
