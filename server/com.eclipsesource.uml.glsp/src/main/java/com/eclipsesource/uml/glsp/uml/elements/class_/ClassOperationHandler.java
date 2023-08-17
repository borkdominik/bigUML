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
package com.eclipsesource.uml.glsp.uml.elements.class_;

import java.util.Set;

import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.glsp.uml.handler.element.NodeOperationHandler;
import com.eclipsesource.uml.modelserver.uml.elements.class_.commands.CreateClassArgument;

public class ClassOperationHandler extends NodeOperationHandler<Class, Package> {

   public ClassOperationHandler() {
      super(Set.of(ClassConfiguration.typeId(), ClassConfiguration.Variant.abstractTypeId()));
   }

   @Override
   protected CreateClassArgument createArgument(final CreateNodeOperation operation, final Package parent) {
      var elementTypeId = operation.getElementTypeId();
      if (elementTypeId.equals(ClassConfiguration.Variant.abstractTypeId())) {
         return new CreateClassArgument(true);

      }

      return new CreateClassArgument(false);
   }
}
