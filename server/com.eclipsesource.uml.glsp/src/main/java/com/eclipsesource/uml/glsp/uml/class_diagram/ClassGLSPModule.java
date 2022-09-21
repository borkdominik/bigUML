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
package com.eclipsesource.uml.glsp.uml.class_diagram;

import org.eclipse.glsp.server.di.MultiBinding;
import org.eclipse.glsp.server.operations.OperationHandler;

import com.eclipsesource.uml.glsp.uml.class_diagram.operations.CreateClassDiagramChildNodeOperationHandler;
import com.eclipsesource.uml.glsp.uml.class_diagram.operations.CreateClassDiagramEdgeOperationHandler;
import com.eclipsesource.uml.glsp.uml.class_diagram.operations.CreateClassDiagramNodeOperationHandler;

public class ClassGLSPModule {

   protected void configureOperationHandlers(final MultiBinding<OperationHandler> bindings) {
      // CLASS
      bindings.add(CreateClassDiagramNodeOperationHandler.class);
      bindings.add(CreateClassDiagramChildNodeOperationHandler.class);
      bindings.add(CreateClassDiagramEdgeOperationHandler.class);
   }
}
