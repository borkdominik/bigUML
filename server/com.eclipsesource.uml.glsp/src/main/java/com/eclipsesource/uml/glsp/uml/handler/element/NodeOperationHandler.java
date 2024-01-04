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
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.handler.operation.create.DiagramCreateNodeHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.delete.DiagramDeleteHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.delete.UmlDeleteOperation;
import com.eclipsesource.uml.glsp.core.handler.operation.update.DiagramUpdateHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.configuration.RepresentationElementConfigurationAccessor;
import com.eclipsesource.uml.glsp.uml.configuration.ElementConfigurationRegistry;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.CreateLocationAwareNodeHandler;
import com.eclipsesource.uml.modelserver.shared.utils.Type;
import com.eclipsesource.uml.modelserver.shared.utils.reflection.ReflectionUtil;
import com.eclipsesource.uml.modelserver.uml.command.create.node.CreateNodeCommandContribution;
import com.eclipsesource.uml.modelserver.uml.command.delete.DeleteElementCommandContribution;
import com.eclipsesource.uml.modelserver.uml.command.update.UpdateElementCommandContribution;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.TypeLiteral;

public abstract class NodeOperationHandler<TElement extends EObject, TParent>
   implements RepresentationElementConfigurationAccessor, CreateLocationAwareNodeHandler, DiagramCreateNodeHandler<TParent>,
   DiagramDeleteHandler<TElement>,
   DiagramUpdateHandler<TElement> {
   protected final Set<String> elementTypeIds;
   protected final Gson gson;
   protected final Representation representation;

   @Inject
   protected TypeLiteral<TElement> elementType;
   @Inject
   protected TypeLiteral<TParent> parentType;

   @Inject
   protected UmlModelServerAccess modelServerAccess;
   @Inject
   protected UmlModelState modelState;
   @Inject
   protected ElementConfigurationRegistry configurationRegistry;

   public NodeOperationHandler(final Representation representation, final String typeId) {
      this(representation, Set.of(typeId));
   }

   public NodeOperationHandler(final Representation representation, final Set<String> typeIds) {
      this.representation = representation;
      this.elementTypeIds = typeIds;
      this.gson = new Gson();
   }

   @Override
   public Set<String> getElementTypeIds() { return elementTypeIds; }

   @Override
   public Class<TElement> getElementType() { return Type.clazz(elementType); }

   @Override
   public Set<Class<? extends TElement>> getElementTypes() { return Set.of(getElementType()); }

   @Override
   public Class<TParent> getParentType() { return Type.clazz(parentType); }

   @Override
   public Representation representation() {
      return representation;
   }

   @Override
   public ElementConfigurationRegistry configurationRegistry() {
      return configurationRegistry;
   }

   @Override
   public void handleCreateNode(final CreateNodeOperation operation) {
      var containerId = operation.getContainerId();
      var container = getOrThrow(modelState.getIndex().getEObject(containerId),
         getParentType(),
         String.format("[%s] No valid container with id %s for container type %s found.", getClass().getSimpleName(),
            containerId, getParentType().getSimpleName()));

      var command = createCommand(operation, container);
      send(command);
   }

   @Override
   public void handleDelete(final UmlDeleteOperation operation, final EObject object) {
      var element = ReflectionUtil.castOrThrow(object,
         getElementType(),
         String.format("[%s] Object is not castable to %s. it was %s", getClass().getSimpleName(),
            getElementType().getSimpleName(), object.getClass().getName()));

      var command = deleteCommand(operation, element);
      send(command);
   }

   @Override
   public void handleUpdate(final UpdateOperation operation, final TElement element) {
      var command = updateCommand(operation, element);
      send(command);
   }

   protected CCommand createCommand(final CreateNodeOperation operation, final TParent parent) {
      return CreateNodeCommandContribution.create(
         this.modelState.getUnsafeRepresentation(),
         getElementType(),
         parent,
         relativeLocationOf(modelState, operation).orElse(GraphUtil.point(0, 0)),
         createArgument(operation, parent));
   }

   protected Object createArgument(final CreateNodeOperation operation, final TParent parent) {
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
      return UpdateElementCommandContribution.create(
         this.modelState.getUnsafeRepresentation(), element, updateArgument(operation, element));
   }

   protected Object updateArgument(final UpdateOperation operation, final TElement element) {
      return gson.fromJson(gson.toJsonTree(operation.getArgs()), Object.class);
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
