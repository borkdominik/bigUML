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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.enumeration;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.diagram.UmlClass_Enumeration;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateChildNodeHandler;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.CreateLocationAwareNodeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration.CreateEnumerationContribution;

public final class CreateEnumerationHandler
   extends BaseCreateChildNodeHandler<Package> implements CreateLocationAwareNodeHandler {

   public CreateEnumerationHandler() {
      super(UmlClass_Enumeration.typeId());
   }

   @Override
   protected CCommand createCommand(final CreateNodeOperation operation, final Package parent) {
      return CreateEnumerationContribution.create(
         parent,
         relativeLocationOf(modelState, operation).orElse(GraphUtil.point(0, 0)));
   }
}
