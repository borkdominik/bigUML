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

import static io.javalin.apibuilder.ApiBuilder.get;
import static org.eclipse.emfcloud.modelserver.emf.common.util.ContextRequest.getParam;
import static org.eclipse.emfcloud.modelserver.emf.common.util.ContextResponse.encodingError;
import static org.eclipse.emfcloud.modelserver.emf.common.util.ContextResponse.missingParameter;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emfcloud.modelserver.common.ModelServerPathParametersV1;
import org.eclipse.emfcloud.modelserver.common.codecs.EncodingException;
import org.eclipse.emfcloud.modelserver.emf.common.JsonResponse;
import org.eclipse.emfcloud.modelserver.emf.common.ModelController;
import org.eclipse.emfcloud.modelserver.emf.common.ModelResourceManager;
import org.eclipse.emfcloud.modelserver.emf.common.ModelServerRoutingV1;
import org.eclipse.emfcloud.modelserver.emf.common.ModelURIConverter;
import org.eclipse.emfcloud.modelserver.emf.common.SchemaController;
import org.eclipse.emfcloud.modelserver.emf.common.ServerController;
import org.eclipse.emfcloud.modelserver.emf.common.SessionController;
import org.eclipse.emfcloud.modelserver.emf.common.codecs.JsonCodec;

import com.google.inject.Inject;

import io.javalin.Javalin;
import io.javalin.http.Context;

public class UmlModelServerRouting extends ModelServerRoutingV1 {

   protected final ModelResourceManager resourceManager;
   protected ModelURIConverter uriConverter;

   @Inject
   public UmlModelServerRouting(final Javalin javalin, final ModelResourceManager resourceManager,
         final ModelController modelController, final SchemaController schemaController,
         final ServerController serverController, final SessionController sessionController) {
      super(javalin, resourceManager, modelController, schemaController, serverController, sessionController);
      this.resourceManager = resourceManager;
   }

   @Override
   @Inject
   public void setModelURIConverter(final ModelURIConverter uriConverter) {
      super.setModelURIConverter(uriConverter);
      this.uriConverter = uriConverter;
   }

   protected void getUmlTypes(final Context ctx) {
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

   protected void createUmlModel(final Context ctx) {
      uriConverter.resolveModelURI(ctx).map(URI::toString).ifPresentOrElse(
            uri -> {
               getParam(ctx, UmlModelServerPathsParameters.DIAGRAM_TYPE).ifPresentOrElse(
                     typeParam -> {
                        boolean result = ((UmlModelResourceManager) resourceManager).addUmlResources(uri, typeParam);
                        ctx.json(result ? JsonResponse.success() : JsonResponse.error());
                     },
                     () -> missingParameter(ctx, UmlModelServerPathsParameters.DIAGRAM_TYPE));
            },
            () -> missingParameter(ctx, ModelServerPathParametersV1.MODEL_URI));
   }

   @Override
   public void bindRoutes() {
      bindRoutes(this::apiEndpoints);
   }

   private void apiEndpoints() {
      get(UmlModelServerPaths.UML_TYPES, this::getUmlTypes);
      get(UmlModelServerPaths.UML_CREATE, this::createUmlModel);
   }

}
