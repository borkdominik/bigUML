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

import java.util.Set;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.handler.operation.create.DiagramCreateNodeHandler;
import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.google.inject.Inject;

public abstract class BaseCreateNodeHandler implements DiagramCreateNodeHandler {
   protected final Set<String> elementTypeIds;

   @Inject
   protected UmlModelServerAccess modelServerAccess;

   public BaseCreateNodeHandler(final String typeId) {
      this(Set.of(typeId));
   }

   public BaseCreateNodeHandler(final Set<String> typeIds) {
      this.elementTypeIds = typeIds;
   }

   @Override
   public Set<String> getElementTypeIds() { return elementTypeIds; }

   @Override
   public void handleCreateNode(final CreateNodeOperation operation) {
      var command = createCommand(operation);
      modelServerAccess.exec(command)
         .thenAccept(response -> {
            if (response.body() == null || response.body().isEmpty()) {
               throw new GLSPServerException("Could not execute command of " + command.getClass().getName());
            }
         });
   }

   protected abstract CCommand createCommand(CreateNodeOperation operation);
}
