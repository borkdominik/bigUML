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

import java.util.Set;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.glsp.server.operations.ReconnectEdgeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.handler.operation.create.DiagramCreateEdgeHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.delete.DiagramDeleteHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.delete.UmlDeleteOperation;
import com.eclipsesource.uml.glsp.core.handler.operation.reconnect_edge.DiagramReconnectEdgeHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.update.DiagramUpdateHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.configuration.RepresentationElementConfigurationAccessor;
import com.eclipsesource.uml.glsp.uml.configuration.ElementConfigurationRegistry;
import com.eclipsesource.uml.modelserver.shared.utils.Type;
import com.eclipsesource.uml.modelserver.shared.utils.reflection.ReflectionUtil;
import com.eclipsesource.uml.modelserver.uml.command.create.edge.CreateEdgeCommandContribution;
import com.eclipsesource.uml.modelserver.uml.command.delete.DeleteElementCommandContribution;
import com.eclipsesource.uml.modelserver.uml.command.reconnect.ReconnectElementCommandContribution;
import com.eclipsesource.uml.modelserver.uml.command.update.UpdateElementCommandContribution;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.TypeLiteral;

public abstract class EdgeOperationHandler<TElement extends EObject, TSource extends EObject, TTarget extends EObject>
   implements RepresentationElementConfigurationAccessor, DiagramCreateEdgeHandler, DiagramDeleteHandler<TElement>,
   DiagramUpdateHandler<TElement>, DiagramReconnectEdgeHandler<TElement> {
   protected final Set<String> elementTypeIds;
   @Inject
   protected TypeLiteral<TElement> elementType;
   @Inject
   protected TypeLiteral<TSource> sourceType;
   @Inject
   protected TypeLiteral<TTarget> targetType;

   protected final Gson gson;
   protected Representation representation;

   @Inject
   protected UmlModelServerAccess modelServerAccess;
   @Inject
   protected UmlModelState modelState;
   @Inject
   protected EMFIdGenerator idGenerator;
   @Inject
   protected ElementConfigurationRegistry configurationRegistry;

   public EdgeOperationHandler(final Representation representation, final String typeId) {
      this(representation, Set.of(typeId));
   }

   public EdgeOperationHandler(final Representation representation, final Set<String> typeIds) {
      this.elementTypeIds = typeIds;
      this.gson = new Gson();
      this.representation = representation;
   }

   @Override
   public Representation representation() {
      return representation;
   }

   @Override
   public ElementConfigurationRegistry configurationRegistry() {
      return configurationRegistry;
   }

   @Override
   public Class<? extends EObject> getElementType() { return Type.clazz(elementType); }

   @Override
   public Set<String> getElementTypeIds() { return elementTypeIds; }

   @Override
   public Set<Class<? extends TElement>> getElementTypes() { return Set.of(Type.clazz(elementType)); }

   @Override
   public void handleCreateEdge(final CreateEdgeOperation operation) {
      var sourceId = operation.getSourceElementId();
      var targetId = operation.getTargetElementId();

      var source = getOrThrow(modelState.getIndex().getEObject(sourceId),
         Type.clazz(sourceType),
         "No valid source with id " + sourceId + " for source type " + Type.clazz(sourceType).getSimpleName()
            + " found.");
      var target = getOrThrow(modelState.getIndex().getEObject(targetId),
         Type.clazz(targetType),
         "No valid target with id " + targetId + " for target type " + Type.clazz(targetType).getSimpleName()
            + " found.");

      var command = createCommand(operation, source, target);
      send(command);
   }

   @Override
   public void handleDelete(final UmlDeleteOperation operation, final EObject object) {
      var element = ReflectionUtil.castOrThrow(object,
         Type.clazz(elementType),
         "Object is not castable to " + Type.clazz(elementType).getName() + ". it was " + object.getClass().getName());

      var command = deleteCommand(operation, element);
      send(command);
   }

   @Override
   public void handleUpdate(final UpdateOperation operation, final TElement element) {
      var command = updateCommand(operation, element);
      send(command);
   }

   @Override
   public void handleReconnect(final ReconnectEdgeOperation operation) {
      var elementId = operation.getEdgeElementId();
      var sourceId = operation.getSourceElementId();
      var targetId = operation.getTargetElementId();

      var semanticElement = getOrThrow(modelState.getIndex().getEObject(elementId),
         Type.clazz(elementType),
         "Could not find semantic element for id '" + elementId + "'.");
      var source = getOrThrow(modelState.getIndex().getEObject(sourceId),
         Type.clazz(sourceType),
         "No valid container with id " + sourceId + " for source type " + Type.clazz(sourceType).getSimpleName()
            + " found.");
      var target = getOrThrow(modelState.getIndex().getEObject(targetId),
         Type.clazz(targetType),
         "No valid container with id " + targetId + " for target type " + Type.clazz(targetType).getSimpleName()
            + " found.");

      var command = reconnectCommand(operation, semanticElement, source, target);
      send(command);
   }

   protected CCommand createCommand(final CreateEdgeOperation operation, final TSource source, final TTarget target) {
      return CreateEdgeCommandContribution.create(
         this.modelState.getUnsafeRepresentation(), Type.clazz(elementType), source, target,
         createArgument(operation, source, target));
   }

   protected Object createArgument(final CreateEdgeOperation operation, final TSource source, final TTarget target) {
      return null;
   }

   protected CCommand deleteCommand(final UmlDeleteOperation operation, final TElement element) {
      return DeleteElementCommandContribution.create(
         this.modelState.getUnsafeRepresentation(), element, deleteArgument(operation, element));
   }

   protected Object deleteArgument(final UmlDeleteOperation operation, final TElement element) {
      return gson.fromJson(gson.toJsonTree(operation.getArgs()), Object.class);
   }

   protected CCommand updateCommand(final UpdateOperation operation, final TElement element) {
      var update = gson.fromJson(gson.toJsonTree(operation.getArgs()), Object.class);

      return UpdateElementCommandContribution.create(
         this.modelState.getUnsafeRepresentation(), element, update);
   }

   protected CCommand reconnectCommand(final ReconnectEdgeOperation operation, final TElement element,
      final TSource source, final TTarget target) {
      return ReconnectElementCommandContribution.create(
         this.modelState.getUnsafeRepresentation(), element,
         Set.of(idGenerator.getOrCreateId(source)),
         Set.of(idGenerator.getOrCreateId(target)));
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
