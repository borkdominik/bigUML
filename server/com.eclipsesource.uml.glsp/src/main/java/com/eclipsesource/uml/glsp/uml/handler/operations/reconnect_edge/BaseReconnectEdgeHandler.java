/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.handler.operations.reconnect_edge;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.Set;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.glsp.server.operations.ReconnectEdgeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.handler.operation.reconnect_edge.DiagramReconnectEdgeHandler;
import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.modelserver.shared.utils.reflection.GenericsUtil;
import com.google.inject.Inject;

public abstract class BaseReconnectEdgeHandler<TElementType extends EObject, TSourceType extends EObject, TTargetType extends EObject>
   implements DiagramReconnectEdgeHandler<TElementType> {
   protected final Class<TElementType> elementType;
   protected final Class<TSourceType> sourceType;
   protected final Class<TTargetType> targetType;

   @Inject
   protected UmlModelState modelState;
   @Inject
   protected UmlModelServerAccess modelServerAccess;
   @Inject
   protected EMFIdGenerator idGenerator;

   public BaseReconnectEdgeHandler() {
      this.elementType = GenericsUtil.getClassParameter(getClass(), BaseReconnectEdgeHandler.class, 0);
      this.sourceType = GenericsUtil.getClassParameter(getClass(), BaseReconnectEdgeHandler.class, 1);
      this.targetType = GenericsUtil.getClassParameter(getClass(), BaseReconnectEdgeHandler.class, 2);
   }

   @Override
   public Set<Class<? extends TElementType>> getElementTypes() { return Set.of(elementType); }

   @Override
   public void handleReconnect(final ReconnectEdgeOperation operation) {
      var elementId = operation.getEdgeElementId();
      var sourceId = operation.getSourceElementId();
      var targetId = operation.getTargetElementId();

      var semanticElement = getOrThrow(modelState.getIndex().getEObject(elementId),
         elementType,
         "Could not find semantic element for id '" + elementId + "'.");
      var source = getOrThrow(modelState.getIndex().getEObject(sourceId),
         sourceType,
         "No valid container with id " + sourceId + " for source type " + sourceType.getSimpleName() + " found.");
      var target = getOrThrow(modelState.getIndex().getEObject(targetId),
         targetType,
         "No valid container with id " + targetId + " for target type " + targetType.getSimpleName() + " found.");

      var command = createCommand(operation, semanticElement, source, target);
      modelServerAccess.exec(command)
         .thenAccept(response -> {
            if (response.body() == null || response.body().isEmpty()) {
               throw new GLSPServerException("Could not execute command of " + command.getClass().getName());
            }
         });
   }

   protected abstract CCommand createCommand(ReconnectEdgeOperation operation, TElementType element, TSourceType source,
      TTargetType target);

}
