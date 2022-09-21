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
package com.eclipsesource.uml.glsp.uml.object_diagram;

import org.eclipse.glsp.server.di.MultiBinding;
import org.eclipse.glsp.server.operations.OperationHandler;

import com.eclipsesource.uml.glsp.uml.object_diagram.operations.CreateObjectDiagramChildNodeOperationHandler;
import com.eclipsesource.uml.glsp.uml.object_diagram.operations.CreateObjectDiagramEdgeOperationHandler;
import com.eclipsesource.uml.glsp.uml.object_diagram.operations.CreateObjectDiagramNodeOperationHandler;

public class ObjectGLSPModule {
   protected void configureOperationHandlers(final MultiBinding<OperationHandler> bindings) {
      bindings.add(CreateObjectDiagramNodeOperationHandler.class);
      bindings.add(CreateObjectDiagramChildNodeOperationHandler.class);
      bindings.add(CreateObjectDiagramEdgeOperationHandler.class);
   }

}
