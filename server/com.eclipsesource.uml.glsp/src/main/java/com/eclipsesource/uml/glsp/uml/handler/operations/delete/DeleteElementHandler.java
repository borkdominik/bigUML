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

import com.eclipsesource.uml.glsp.core.handler.operation.DiagramDeleteHandler;
import com.eclipsesource.uml.glsp.core.model.UmlModelServerAccess;
import com.eclipsesource.uml.glsp.core.model.UmlModelState;
import com.eclipsesource.uml.glsp.core.utils.reflection.GenericsUtil;
import com.eclipsesource.uml.glsp.core.utils.reflection.ReflectionUtil;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public abstract class DeleteElementHandler<T extends EObject> implements DiagramDeleteHandler {
   protected final Class<T> elementType;
   protected final String elementTypeId;
   protected final Representation representation;

   @Inject
   protected UmlModelState modelState;

   @Inject
   protected UmlModelServerAccess modelServerAccess;

   public DeleteElementHandler(final Representation representation, final String typeId) {
      this.representation = representation;
      this.elementTypeId = typeId;
      this.elementType = GenericsUtil.deriveClassActualType(getClass(), DeleteElementHandler.class, 0);
   }

   @Override
   public String getHandledElementTypeId() { return elementTypeId; }

   @Override
   public Representation getRepresentation() { return representation; }

   @Override
   public void executeDeletion(final EObject object) {
      var element = ReflectionUtil.castOrThrow(object,
         elementType,
         "Object is not castable to " + elementType.getName() + ". it was " + object.getClass().getName());

      modelServerAccess.exec(command(element))
         .thenAccept(response -> {
            if (response.body() == null || response.body().isEmpty()) {
               throw new GLSPServerException("Could not execute delete on " + elementTypeId);
            }
         });
   }

   protected abstract CCommand command(T element);
}
