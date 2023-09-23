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

import java.util.Set;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.handler.operation.update.DiagramUpdateHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.modelserver.shared.utils.reflection.GenericsUtil;
import com.google.gson.Gson;
import com.google.inject.Inject;

@Deprecated(forRemoval = true)
public abstract class BaseUpdateElementHandler<TElementType extends EObject, TUpdateArgument>
   implements DiagramUpdateHandler<TElementType> {
   protected final Class<TElementType> elementType;
   protected final Class<TUpdateArgument> updateArgumentType;

   protected final String contextId;
   protected final Gson gson;

   @Inject
   protected UmlModelState modelState;

   @Inject
   protected UmlModelServerAccess modelServerAccess;

   public BaseUpdateElementHandler(final String contextId) {
      this.contextId = contextId;

      this.elementType = GenericsUtil.getClassParameter(getClass(), BaseUpdateElementHandler.class, 0);
      this.updateArgumentType = GenericsUtil.getClassParameter(getClass(), BaseUpdateElementHandler.class, 1);

      this.gson = new Gson();
   }

   @Override
   public Set<Class<? extends TElementType>> getElementTypes() { return Set.of(elementType); }

   @Override
   public void handleUpdate(final UpdateOperation operation, final TElementType element) {
      TUpdateArgument updateArgument = gson.fromJson(gson.toJsonTree(operation.getArgs()), this.updateArgumentType);

      var command = createCommand(operation, element, updateArgument);
      modelServerAccess.exec(command)
         .thenAccept(response -> {
            if (response.body() == null || response.body().isEmpty()) {
               throw new GLSPServerException("Could not execute command of " + command.getClass().getName());
            }
         });
   }

   protected abstract CCommand createCommand(UpdateOperation operation, TElementType element,
      TUpdateArgument updateArgument);
}
