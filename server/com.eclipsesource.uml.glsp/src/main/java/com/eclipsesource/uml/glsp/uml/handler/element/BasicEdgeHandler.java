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
package com.eclipsesource.uml.glsp.uml.handler.element;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.handler.operation.create.DiagramCreateEdgeHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.delete.DiagramDeleteHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.update.DiagramUpdateHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.CreateLocationAwareNodeHandler;
import com.eclipsesource.uml.modelserver.shared.utils.reflection.GenericsUtil;
import com.eclipsesource.uml.modelserver.shared.utils.reflection.ReflectionUtil;
import com.eclipsesource.uml.modelserver.uml.command.create.CreateElementCommandContribution;
import com.eclipsesource.uml.modelserver.uml.command.delete.DeleteElementCommandContribution;
import com.eclipsesource.uml.modelserver.uml.command.update.UpdateElementCommandContribution;
import com.google.gson.Gson;
import com.google.inject.Inject;

public abstract class BasicEdgeHandler<TElement extends EObject, TSource extends EObject, TTarget extends EObject>
   implements CreateLocationAwareNodeHandler, DiagramCreateEdgeHandler, DiagramDeleteHandler<TElement>,
   DiagramUpdateHandler<TElement> {
   protected final String elementTypeId;
   protected final Class<TElement> elementType;
   protected final Class<TSource> sourceType;
   protected final Class<TTarget> targetType;
   protected final Gson gson;

   @Inject
   protected UmlModelServerAccess modelServerAccess;
   @Inject
   protected UmlModelState modelState;

   public BasicEdgeHandler(final String typeId) {
      this.elementTypeId = typeId;
      this.elementType = GenericsUtil.getClassParameter(getClass(), BasicEdgeHandler.class, 0);
      this.sourceType = GenericsUtil.getClassParameter(getClass(), BasicEdgeHandler.class, 1);
      this.targetType = GenericsUtil.getClassParameter(getClass(), BasicEdgeHandler.class, 2);
      this.gson = new Gson();
   }

   @Override
   public String getElementTypeId() { return elementTypeId; }

   @Override
   public Class<TElement> getElementType() { return elementType; }

   @Override
   public void handleCreateEdge(final CreateEdgeOperation operation) {
      var sourceId = operation.getSourceElementId();
      var targetId = operation.getTargetElementId();

      var source = getOrThrow(modelState.getIndex().getEObject(sourceId),
         sourceType,
         "No valid source with id " + sourceId + " for source type " + sourceType.getSimpleName() + " found.");
      var target = getOrThrow(modelState.getIndex().getEObject(targetId),
         targetType,
         "No valid target with id " + targetId + " for target type " + targetType.getSimpleName() + " found.");

      var command = createCommand(operation, source, target);
      send(command);
   }

   @Override
   public void handleDelete(final EObject object) {
      var element = ReflectionUtil.castOrThrow(object,
         elementType,
         "Object is not castable to " + elementType.getName() + ". it was " + object.getClass().getName());

      var command = deleteCommand(element);
      send(command);
   }

   @Override
   public void handleUpdate(final UpdateOperation operation, final TElement element) {
      var command = updateCommand(operation, element);
      send(command);
   }

   protected CCommand createCommand(final CreateEdgeOperation operation, final TSource source, final TTarget target) {
      return CreateElementCommandContribution.create(
         this.modelState.getUnsafeRepresentation(), elementType, source, target);
   }

   protected CCommand deleteCommand(final TElement element) {
      return DeleteElementCommandContribution.create(
         this.modelState.getUnsafeRepresentation(), element);
   }

   protected CCommand updateCommand(final UpdateOperation operation, final TElement element) {
      var update = gson.fromJson(gson.toJsonTree(operation.getArgs()), Object.class);

      return UpdateElementCommandContribution.create(
         this.modelState.getUnsafeRepresentation(), element, update);
   }

   protected void send(final CCommand command) {
      modelServerAccess.exec(command)
         .thenAccept(response -> {
            if (response.body() == null || response.body().isEmpty()) {
               throw new GLSPServerException("Could not execute command of " + command.getClass().getName());
            }
         });
   }
}
