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
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.AbstractEMSCreateEdgeOperationHandler;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.core.utils.reflection.GenericsUtil;
import com.google.inject.Inject;

public abstract class CreateEdgeHandler<S extends Element, T extends Element>
   extends AbstractEMSCreateEdgeOperationHandler {
   protected final Class<S> sourceClass;
   protected final Class<T> targetClass;

   @Inject
   protected UmlModelServerAccess modelServerAccess;

   @Inject
   protected UmlModelState modelState;

   public CreateEdgeHandler(final String type) {
      super(type);

      sourceClass = GenericsUtil.deriveClassActualType(getClass(), CreateEdgeHandler.class, 0);
      targetClass = GenericsUtil.deriveClassActualType(getClass(), CreateEdgeHandler.class, 1);
   }

   @Override
   public void executeOperation(final CreateEdgeOperation operation) {
      var sourceId = operation.getSourceElementId();
      var targetId = operation.getTargetElementId();

      var source = getOrThrow(modelState.getIndex().getEObject(sourceId),
         sourceClass, "No valid container with id " + sourceId + " found");
      var target = getOrThrow(modelState.getIndex().getEObject(targetId),
         targetClass, "No valid container with id " + targetId + " found");

      modelServerAccess.exec(create(source, target))
         .thenAccept(response -> {
            if (response.body() == null || response.body().isEmpty()) {
               throw new GLSPServerException("Could not execute CreateOperation on " + getLabel());
            }
         });
   }

   protected abstract CCommand create(S source, T target);
}
