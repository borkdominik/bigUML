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
package com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.element_import;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.PackageableElement;

import com.eclipsesource.uml.glsp.uml.diagram.package_diagram.diagram.UmlPackage_ElementImport;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateEdgeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.element_import.CreateElementImportContribution;

public final class CreateElementImportHandler extends BaseCreateEdgeHandler<Package, PackageableElement> {

   public CreateElementImportHandler() {
      super(UmlPackage_ElementImport.typeId());
   }

   @Override
   protected CCommand createCommand(final CreateEdgeOperation operation, final Package source,
      final PackageableElement target) {
      return CreateElementImportContribution.create(source, target);
   }

}
