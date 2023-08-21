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

import com.eclipsesource.uml.glsp.uml.configuration.ElementConfigurationRegistry;
import com.eclipsesource.uml.glsp.uml.handler.element.NodeOperationHandler;
import com.eclipsesource.uml.modelserver.shared.registry.RepresentationKey;
import com.eclipsesource.uml.modelserver.uml.elements.class_.commands.CreateClassArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ClassOperationHandler extends NodeOperationHandler<Class, Package> {

   @Inject
   public ClassOperationHandler(@Assisted final Representation representation,
      final ElementConfigurationRegistry registry) {
      super(representation, Set.of(
         registry.accessTyped(new RepresentationKey<>(representation, Class.class), ClassConfiguration.class).typeId(),
         registry.accessTyped(new RepresentationKey<>(representation, Class.class), ClassConfiguration.class)
            .abstractTypeId()));
   }

   @Override
   protected CreateClassArgument createArgument(final CreateNodeOperation operation, final Package parent) {
      var elementTypeId = operation.getElementTypeId();
      if (elementTypeId.equals(configuration(ClassConfiguration.class).abstractTypeId())) {
         return new CreateClassArgument(true);

      }

      return new CreateClassArgument(false);
   }
}
