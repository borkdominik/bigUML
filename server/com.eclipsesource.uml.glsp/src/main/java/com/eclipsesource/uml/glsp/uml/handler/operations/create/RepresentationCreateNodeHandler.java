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
package com.eclipsesource.uml.glsp.uml.handler.operations.create;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.Set;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.handler.operation.create.DiagramCreateNodeHandler;
import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.uml.configuration.ElementConfigurationAccessor;
import com.eclipsesource.uml.glsp.uml.configuration.ElementConfigurationRegistry;
import com.eclipsesource.uml.modelserver.shared.utils.Type;
import com.eclipsesource.uml.modelserver.uml.command.create.node.CreateNodeCommandContribution;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.TypeLiteral;

public class RepresentationCreateNodeHandler<TElement extends EObject, TParent>
   implements ElementConfigurationAccessor, CreateLocationAwareNodeHandler, DiagramCreateNodeHandler<TParent> {
   protected final Set<String> elementTypeIds;
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

   public RepresentationCreateNodeHandler(final Representation representation, final String typeId) {
      this(representation, Set.of(typeId));
   }

   public RepresentationCreateNodeHandler(final Representation representation, final Set<String> typeIds) {
      this.representation = representation;
      this.elementTypeIds = typeIds;
   }

   @Override
   public Set<String> getElementTypeIds() { return elementTypeIds; }

   @Override
   public Class<TElement> getElementType() { return Type.clazz(elementType); }

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

   protected void send(final CCommand command) {
      modelServerAccess.exec(command)
         .thenAccept(response -> {
            if (response.body() == null || response.body().isEmpty()) {
               throw new GLSPServerException("Could not execute command of " + command.getClass().getName());
            }
         });
   }
}
