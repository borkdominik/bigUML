/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.operations;

import java.util.List;

import org.eclipse.glsp.server.internal.util.GenericsUtil;
import org.eclipse.glsp.server.model.GModelState;
import org.eclipse.glsp.server.operations.BasicCreateOperationHandler;
import org.eclipse.glsp.server.operations.CreateOperation;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.modelserver.UmlModelServerAccess;
import com.google.common.collect.Lists;

@SuppressWarnings("restriction")
public abstract class ModelServerAwareBasicCreateOperationHandler<T extends CreateOperation>
   extends BasicCreateOperationHandler<T> implements ModelserverAwareOperationHandler<T> {

   public ModelServerAwareBasicCreateOperationHandler(final String... elementTypeIds) {
      super(Lists.newArrayList(elementTypeIds));
   }

   public ModelServerAwareBasicCreateOperationHandler(final List<String> handledElementTypeIds) {
      super(handledElementTypeIds);
   }

   @SuppressWarnings("unchecked")
   @Override
   protected Class<T> deriveOperationType() {
      return (Class<T>) (GenericsUtil.getParametrizedType(getClass(),
         ModelServerAwareBasicCreateOperationHandler.class)).getActualTypeArguments()[0];
   }

   @Override
   public void executeOperation(final T operation, final GModelState modelState) {
      if (handles(operation)) {
         try {
            UmlModelServerAccess modelServerAccess = UmlModelState.getModelServerAccess(modelState);
            executeOperation(operationType.cast(operation), modelState, modelServerAccess);
         } catch (Exception ex) {
            if (ex instanceof RuntimeException) {
               // simply re-throw
               throw (RuntimeException) ex;
            }
            throw new RuntimeException(ex);
         }
      }
   }
}
