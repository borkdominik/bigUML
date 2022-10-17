/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.handler.create;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import org.eclipse.emfcloud.modelserver.client.Response;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.AbstractEMSCreateNodeOperationHandler;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.core.utils.reflection.GenericsUtil;
import com.google.inject.Inject;

public abstract class CreateChildNodeHandler<T extends Element> extends AbstractEMSCreateNodeOperationHandler {

   protected final Class<T> containerClass;

   @Inject
   protected UmlModelServerAccess modelServerAccess;

   @Inject
   protected UmlModelState modelState;

   public CreateChildNodeHandler(final String type) {
      super(type);

      this.containerClass = GenericsUtil.deriveClassActualType(getClass(), CreateChildNodeHandler.class, 0);
   }

   @Override
   public void executeOperation(final CreateNodeOperation operation) {
      var containerId = operation.getContainerId();
      var container = getOrThrow(modelState.getIndex().getEObject(containerId),
         containerClass, "No valid container with id " + containerId + " found");

      create(container, operation.getLocation())
         .thenAccept(response -> {
            if (response.body() == null || response.body().isEmpty()) {
               throw new GLSPServerException("Could not execute CreateOperation on " + getLabel());
            }
         });
   }

   protected abstract CompletableFuture<Response<String>> create(T container, Optional<GPoint> location);

}
