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

import java.util.List;

import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;

public abstract class BaseCreateEdgeBetweenNodesHandler<S, T>
   extends BaseCreateEdgeHandler<S, T> {

   public BaseCreateEdgeBetweenNodesHandler(final String typeId) {
      super(typeId);
   }

   @Override
   public void create(final CreateEdgeOperation operation) {
      var sourceId = operation.getSourceElementId();
      var targetId = operation.getTargetElementId();

      var sourceGNode = getOrThrow(modelState.getIndex().get(sourceId),
         GNode.class, "No GNode found for sourceId " + sourceId);
      var sourceGType = sourceGNode.getType();

      var targetGNode = getOrThrow(modelState.getIndex().get(targetId),
         GNode.class, "No GNode found for targetId " + targetId);
      var targetGType = targetGNode.getType();

      if (!sources().contains(sourceGType) || !targets().contains(targetGType)) {
         throw new GLSPServerException("Could not handle " + operation.getClass().getSimpleName() + ". Source type "
            + sourceGType + " or target type " + targetGType + " not included in sources " + sources() + " or targets "
            + targets());
      }

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

   protected abstract List<String> sources();

   protected abstract List<String> targets();

}
