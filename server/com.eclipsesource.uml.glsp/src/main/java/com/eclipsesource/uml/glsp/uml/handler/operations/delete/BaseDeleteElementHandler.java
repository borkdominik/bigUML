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
package com.eclipsesource.uml.glsp.uml.handler.operations.delete;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.eclipsesource.uml.glsp.core.handler.operation.delete.DiagramDeleteHandler;
import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.modelserver.shared.utils.reflection.GenericsUtil;
import com.eclipsesource.uml.modelserver.shared.utils.reflection.ReflectionUtil;
import com.google.inject.Inject;

@Deprecated(forRemoval = true)
public abstract class BaseDeleteElementHandler<T extends EObject> implements DiagramDeleteHandler<T> {
   protected final Class<T> elementType;

   @Inject
   protected UmlModelState modelState;

   @Inject
   protected UmlModelServerAccess modelServerAccess;

   public BaseDeleteElementHandler() {
      this.elementType = GenericsUtil.getClassParameter(getClass(), BaseDeleteElementHandler.class, 0);
   }

   @Override
   public Class<T> getElementType() { return elementType; }

   @Override
   public void handleDelete(final EObject object) {
      var element = ReflectionUtil.castOrThrow(object,
         elementType,
         "Object is not castable to " + elementType.getName() + ". it was " + object.getClass().getName());

      var command = createCommand(element);
      modelServerAccess.exec(command)
         .thenAccept(response -> {
            if (response.body() == null || response.body().isEmpty()) {
               throw new GLSPServerException("Could not execute command if " + command.getClass().getName());
            }
         });
   }

   protected abstract CCommand createCommand(T element);
}
