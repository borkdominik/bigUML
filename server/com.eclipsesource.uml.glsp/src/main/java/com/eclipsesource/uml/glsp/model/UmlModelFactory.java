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
package com.eclipsesource.uml.glsp.model;

import java.util.Map;
import java.util.Optional;

import org.apache.log4j.Logger;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GModelRoot;
import org.eclipse.glsp.graph.builder.impl.GGraphBuilder;
import org.eclipse.glsp.server.actions.ActionDispatcher;
import org.eclipse.glsp.server.features.core.model.ModelFactory;
import org.eclipse.glsp.server.features.core.model.RequestModelAction;
import org.eclipse.glsp.server.model.GModelState;
import org.eclipse.glsp.server.protocol.GLSPServerException;
import org.eclipse.glsp.server.utils.ClientOptions;

import com.eclipsesource.uml.glsp.modelserver.ModelServerClientProvider;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.eclipsesource.uml.modelserver.UmlModelServerClient;
import com.google.inject.Inject;

public class UmlModelFactory implements ModelFactory {

   private static Logger LOGGER = Logger.getLogger(UmlModelFactory.class.getSimpleName());

   private static final String ROOT_ID = "sprotty";
   public static final String WORKSPACE_ROOT_OPTION = "workspaceRoot";

   @Inject
   private ModelServerClientProvider modelServerClientProvider;

   @Inject
   private ActionDispatcher actionDispatcher;

   @Override
   public GModelRoot loadModel(final RequestModelAction action, final GModelState graphicalModelState) {
      String sourceURI = getSourceURI(action.getOptions());
      if (sourceURI.isEmpty()) {
         LOGGER.error("No source uri given to load model, return empty model.");
         return createEmptyRoot();
      }
      Optional<UmlModelServerClient> modelServerClient = modelServerClientProvider.get();
      if (modelServerClient.isEmpty()) {
         LOGGER.error("Connection to modelserver has not been initialized, return empty model");
         return createEmptyRoot();
      }

      UmlModelServerAccess modelServerAccess = new UmlModelServerAccess(sourceURI, modelServerClient.get());

      UmlModelState modelState = UmlModelState.getModelState(graphicalModelState);
      try {
         modelState.initializeModelState(action.getOptions(), modelServerAccess);
      } catch (GLSPServerException e) {
         LOGGER.error("Error during UmlModelState initialization, return empty model.");
         e.printStackTrace();
         return createEmptyRoot();
      }

      if (modelState.getRoot() == null || modelState.getUmlFacade() == null || modelState.getRoot() == null) {
         LOGGER.error("UmlModelState was not fully initialized, return empty model.");
         return createEmptyRoot();
      }

      modelServerAccess
         .subscribe(new UmlModelServerSubscriptionListener(modelState, actionDispatcher));

      return modelState.getRoot();
   }

   private static GModelRoot createEmptyRoot() {
      return new GGraphBuilder(DefaultTypes.GRAPH)//
         .id(ROOT_ID) //
         .build();
   }

   private String getSourceURI(final Map<String, String> clientOptions) {
      String sourceURI = ClientOptions.getValue(clientOptions, ClientOptions.SOURCE_URI)
         .orElseThrow(() -> new GLSPServerException("No source uri given to load model!"));
      String workspaceRoot = ClientOptions.getValue(clientOptions, WORKSPACE_ROOT_OPTION)
         .orElseThrow(() -> new GLSPServerException("No workspaceUri given to load model!"));

      return sourceURI.replace(workspaceRoot.replaceFirst("file://", ""), "").replaceFirst("/", "");
   }

}
