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
package com.eclipsesource.uml.glsp.uml.handler.operations.create;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.core.utils.reflection.GenericsUtil;
import com.google.inject.Inject;

public abstract class BaseCreateEdgeHandler<S, T>
   extends BaseCreateHandler<CreateEdgeOperation> {
   protected final Class<S> sourceType;
   protected final Class<T> targetType;

   @Inject
   protected UmlModelServerAccess modelServerAccess;

   @Inject
   protected UmlModelState modelState;

   public BaseCreateEdgeHandler(final String typeId) {
      super(typeId);

      sourceType = GenericsUtil.getClassParameter(getClass(), BaseCreateEdgeHandler.class, 0);
      targetType = GenericsUtil.getClassParameter(getClass(), BaseCreateEdgeHandler.class, 1);
   }

   @Override
   public void execute(final CreateEdgeOperation operation) {
      var sourceId = operation.getSourceElementId();
      var targetId = operation.getTargetElementId();

      var source = getOrThrow(modelState.getIndex().getEObject(sourceId),
         sourceType,
         "No valid container with id " + sourceId + " for source type " + sourceType.getSimpleName() + " found.");
      var target = getOrThrow(modelState.getIndex().getEObject(targetId),
         targetType,
         "No valid container with id " + targetId + " for target type " + targetType.getSimpleName() + " found.");

      var command = createCommand(operation, source, target);
      modelServerAccess.exec(command)
         .thenAccept(response -> {
            if (response.body() == null || response.body().isEmpty()) {
               throw new GLSPServerException("Could not execute command of " + command.getClass().getName());
            }
         });
   }

   protected abstract CCommand createCommand(CreateEdgeOperation operation, S source, T target);
}
