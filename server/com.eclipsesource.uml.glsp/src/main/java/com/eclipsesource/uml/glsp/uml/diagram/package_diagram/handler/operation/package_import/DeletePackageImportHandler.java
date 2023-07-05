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
package com.eclipsesource.uml.glsp.uml.diagram.package_diagram.handler.operation.package_import;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.PackageImport;

import com.eclipsesource.uml.glsp.uml.handler.operations.delete.BaseDeleteElementHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.package_diagram.commands.package_import.DeletePackageImportContribution;

public final class DeletePackageImportHandler extends BaseDeleteElementHandler<PackageImport> {

   @Override
   protected CCommand createCommand(final PackageImport element) {
      return DeletePackageImportContribution.create(element);
   }
}
