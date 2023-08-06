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
package com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.upackage;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.diagram.UmlPackage_Package;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateChildNodeHandler;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.CreateLocationAwareNodeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.upackage.CreatePackageContribution;

public class CreatePackageHandler extends BaseCreateChildNodeHandler<Package>
   implements CreateLocationAwareNodeHandler {

   public CreatePackageHandler() {
      super(UmlPackage_Package.typeId());
   }

   @Override
   protected CCommand createCommand(final CreateNodeOperation operation, final Package parent) {
      return CreatePackageContribution.create(
         parent,
         relativeLocationOf(modelState, operation).orElse(GraphUtil.point(0, 0)));
   }
}
