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

import java.util.Set;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.handler.operation.create.DiagramCreateNodeHandler;
import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.modelserver.shared.utils.reflection.GenericsUtil;
import com.google.inject.Inject;

public abstract class BaseCreateChildNodeHandler<T> implements DiagramCreateNodeHandler {
   protected final Set<String> elementTypeIds;
   protected final Class<T> containerType;

   @Inject
   protected UmlModelServerAccess modelServerAccess;

   @Inject
   protected UmlModelState modelState;

   public BaseCreateChildNodeHandler(final String typeId) {
      this(Set.of(typeId));
   }

   public BaseCreateChildNodeHandler(final Set<String> typeIds) {
      this.elementTypeIds = typeIds;

      this.containerType = GenericsUtil.getClassParameter(getClass(), BaseCreateChildNodeHandler.class, 0);
   }

   @Override
   public Set<String> getElementTypeIds() { return elementTypeIds; }

   @Override
   public void handleCreateNode(final CreateNodeOperation operation) {
      var containerId = operation.getContainerId();
      var container = getOrThrow(modelState.getIndex().getEObject(containerId),
         containerType,
         "No valid container with id " + containerId + " for container type " + containerType.getSimpleName()
            + " found.");

      var command = createCommand(operation, container);
      modelServerAccess.exec(command)
         .thenAccept(response -> {
            if (response.body() == null || response.body().isEmpty()) {
               throw new GLSPServerException("Could not execute create on " + elementTypeIds + " for command "
                  + command.getClass().getName());
            }
         });
   }

   protected abstract CCommand createCommand(CreateNodeOperation operation, T parent);

}
