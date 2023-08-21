/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.manifest.node;

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.glsp.core.handler.operation.create.DiagramCreateNodeHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.delete.DiagramDeleteHandler;
import com.eclipsesource.uml.glsp.core.handler.operation.update.DiagramUpdateHandler;
import com.eclipsesource.uml.glsp.uml.handler.element.NodeOperationHandler;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.TypeLiteral;
import com.google.inject.multibindings.Multibinder;

public abstract class NodeOperationHandlerDefinition extends NodeDefinition {

   public NodeOperationHandlerDefinition(final String id, final Representation representation) {
      super(id, representation);
   }

   protected abstract Optional<TypeLiteral<? extends NodeOperationHandler<?, ?>>> operationHandler();

   @Override
   protected void diagramCreateHandlers(final Multibinder<DiagramCreateNodeHandler> contribution) {
      operationHandler().ifPresent(i -> contribution.addBinding().to(i));
   }

   @Override
   protected void diagramDeleteHandlers(final Multibinder<DiagramDeleteHandler<? extends EObject>> contribution) {
      operationHandler().ifPresent(i -> contribution.addBinding().to(i));
   }

   @Override
   protected void diagramUpdateHandlers(final Multibinder<DiagramUpdateHandler<? extends EObject>> contribution) {
      operationHandler().ifPresent(i -> contribution.addBinding().to(i));
   }
}
