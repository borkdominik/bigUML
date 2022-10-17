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

import java.util.Optional;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.glsp.operations.handlers.AbstractEMSCreateNodeOperationHandler;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.google.inject.Inject;

public abstract class CreateNodeHandler extends AbstractEMSCreateNodeOperationHandler {

   @Inject
   protected UmlModelServerAccess modelServerAccess;

   public CreateNodeHandler(final String type) {
      super(type);
   }

   @Override
   public void executeOperation(final CreateNodeOperation operation) {
      modelServerAccess.exec(create(operation.getLocation()))
         .thenAccept(response -> {
            if (response.body() == null || response.body().isEmpty()) {
               throw new GLSPServerException("Could not execute CreateOperation on " + getLabel());
            }
         });
   }

   protected abstract CCommand create(Optional<GPoint> location);
}
