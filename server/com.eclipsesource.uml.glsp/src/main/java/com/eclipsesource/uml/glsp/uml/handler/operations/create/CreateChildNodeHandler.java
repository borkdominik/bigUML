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

import java.util.Optional;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.uml2.uml.Element;

import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.core.utils.reflection.GenericsUtil;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public abstract class CreateChildNodeHandler<T extends Element> extends BaseCreateHandler<CreateNodeOperation> {

   protected final Class<T> containerType;

   @Inject
   protected UmlModelServerAccess modelServerAccess;

   @Inject
   protected UmlModelState modelState;

   public CreateChildNodeHandler(final Representation representation, final String typeId) {
      super(representation, typeId);

      this.containerType = GenericsUtil.deriveClassActualType(getClass(), CreateChildNodeHandler.class, 0);
   }

   @Override
   public void create(final CreateNodeOperation operation) {
      var containerId = operation.getContainerId();
      var container = getOrThrow(modelState.getIndex().getEObject(containerId),
         containerType, "No valid container with id " + containerId + " found");

      modelServerAccess.exec(command(container, operation.getLocation()))
         .thenAccept(response -> {
            if (response.body() == null || response.body().isEmpty()) {
               throw new GLSPServerException("Could not execute create on " + elementTypeId);
            }
         });
   }

   protected abstract CCommand command(T container, Optional<GPoint> location);

}
