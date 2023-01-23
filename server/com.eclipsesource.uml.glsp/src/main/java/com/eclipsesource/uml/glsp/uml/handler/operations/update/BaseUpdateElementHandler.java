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
package com.eclipsesource.uml.glsp.uml.handler.operations.update;

import static org.eclipse.glsp.server.types.GLSPServerException.getOrThrow;

import java.util.HashMap;
import java.util.Map;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.handler.operation.update.DiagramUpdateHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.core.utils.reflection.GenericsUtil;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.google.inject.Inject;

public abstract class BaseUpdateElementHandler<TObject extends EObject, TArgs extends Object>
   implements DiagramUpdateHandler<TObject> {
   protected final Class<TObject> elementType;
   protected final Class<TArgs> argsType;
   protected final String contextId;
   protected final Gson gson;

   @Inject
   protected UmlModelState modelState;

   @Inject
   protected UmlModelServerAccess modelServerAccess;

   public BaseUpdateElementHandler(final String contextId, final Class<TArgs> argsType) {
      this.contextId = contextId;
      this.argsType = argsType;
      this.elementType = GenericsUtil.getClassParameter(getClass(), BaseUpdateElementHandler.class, 0);

      this.gson = new Gson();
   }

   @Override
   public Class<TObject> getElementType() { return elementType; }

   @Override
   public String contextId() {
      return contextId;
   }

   public UpdateOperation asOperation(final String elementId, final TArgs args) {
      return asOperation(elementId, args, new HashMap<>());
   }

   public UpdateOperation asOperation(final String elementId, final TArgs args, final Map<String, String> context) {
      var type = new TypeToken<Map<String, String>>() {}.getType();

      return new UpdateOperation(
         elementId,
         this.contextId,
         context,
         gson.fromJson(gson.toJsonTree(args), type));
   }

   @Override
   public void handle(final UpdateOperation operation) {
      var elementId = operation.getElementId();

      var semanticElement = getOrThrow(modelState.getIndex().getEObject(elementId),
         elementType,
         "Could not find semantic element for id '" + elementId + "'.");

      var args = gson.fromJson(gson.toJsonTree(operation.getArgs()), this.argsType);

      var command = createCommand(operation, semanticElement, args);
      modelServerAccess.exec(command)
         .thenAccept(response -> {
            if (response.body() == null || response.body().isEmpty()) {
               throw new GLSPServerException("Could not execute command of " + command.getClass().getName());
            }
         });
   }

   protected abstract CCommand createCommand(UpdateOperation operation, TObject element, TArgs args);
}
