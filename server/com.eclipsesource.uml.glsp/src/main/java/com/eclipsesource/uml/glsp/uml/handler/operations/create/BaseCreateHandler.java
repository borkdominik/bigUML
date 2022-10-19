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

import org.eclipse.glsp.server.operations.CreateOperation;

import com.eclipsesource.uml.glsp.core.handler.operation.DiagramCreateHandler;
import com.eclipsesource.uml.glsp.core.utils.reflection.GenericsUtil;

public abstract class BaseCreateHandler<T extends CreateOperation> implements DiagramCreateHandler {
   protected final Class<T> operationType;
   protected final String elementTypeId;

   public BaseCreateHandler(final String typeId) {
      this.elementTypeId = typeId;
      this.operationType = GenericsUtil.deriveClassActualType(getClass(), BaseCreateHandler.class, 0);
   }

   @Override
   public String getHandledElementTypeId() { return elementTypeId; }

   @Override
   public void executeOperation(final CreateOperation operation) {
      create(operationType.cast(operation));
   }

   abstract protected void create(T operation);
}
